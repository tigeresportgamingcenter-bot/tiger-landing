import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
let failures = 0;

function pass(message) { process.stdout.write(`PASS  ${message}\n`); }
function warn(message) { process.stdout.write(`WARN  ${message}\n`); }
function fail(message) { failures += 1; process.stdout.write(`FAIL  ${message}\n`); }
function read(path) { return readFileSync(join(root, path), "utf8"); }

const requiredFiles = [
  "supabase/migrations/20260628_phase2a.sql",
  "supabase/migrations/20260628_phase2a_hardening.sql",
  "lib/supabase/client.ts",
  "lib/supabase/server.ts",
  "middleware.ts",
  ".env.example",
];
for (const file of requiredFiles) {
  if (existsSync(join(root, file))) pass(file);
  else fail(`Thiếu ${file}`);
}

const gitignore = read(".gitignore");
if (/\.env\*/.test(gitignore)) pass(".gitignore chặn file env");
else fail(".gitignore chưa chặn file env");
if (existsSync(join(root, ".env.local"))) warn("Có .env.local; hãy dùng git check-ignore trước khi commit");
else warn("Chưa có .env.local; landing sẽ dùng fallback static");

const envExample = read(".env.example");
for (const name of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SITE_URL"]) {
  if (envExample.includes(`${name}=`)) pass(`Có biến mẫu ${name}`);
  else fail(`Thiếu biến mẫu ${name}`);
}

const migration = read("supabase/migrations/20260628_phase2a.sql");
for (const table of ["admin_users", "branches", "promotions", "tournaments", "hall_of_fame_members", "site_images", "gallery_items"]) {
  if (migration.includes(`public.${table}`)) pass(`Schema có ${table}`);
  else fail(`Schema thiếu ${table}`);
}
for (const bucket of ["hero", "branches", "community", "hall-of-fame", "members"]) {
  if (migration.includes(`'${bucket}'`)) pass(`Storage có ${bucket}`);
  else fail(`Storage thiếu ${bucket}`);
}
for (const rule of ["published and verified", "published and verified and consent_confirmed", "public.is_admin()", "enable row level security"]) {
  if (migration.includes(rule)) pass(`RLS có ${rule}`);
  else fail(`RLS thiếu ${rule}`);
}

const excluded = new Set(["node_modules", ".next", ".git", ".vercel"]);
const secretPatterns = [/sb_secret_[A-Za-z0-9_-]+/, /SUPABASE_SERVICE_ROLE_KEY\s*=\s*\S+/, /eyJ[A-Za-z0-9_-]{40,}\.[A-Za-z0-9_-]{20,}/];
function scan(directory) {
  for (const entry of readdirSync(directory)) {
    if (excluded.has(entry) || entry === "package-lock.json") continue;
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) { scan(path); continue; }
    const content = readFileSync(path, "utf8");
    if (secretPatterns.some((pattern) => pattern.test(content))) fail(`Phát hiện chuỗi giống secret trong ${path.slice(root.length + 1)}`);
  }
}
scan(root);
if (!failures) pass("Không phát hiện secret thật trong source được quét");

if (failures) {
  process.stdout.write(`\nPhase 2A readiness: FAIL (${failures} lỗi)\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("\nPhase 2A readiness: PASS\n");
}
