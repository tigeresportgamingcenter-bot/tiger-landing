/** One looping clip in the "Không gian Tiger" section. Files live in public/videos/khong-gian. */
export interface SpaceVideo {
  id: string;
  title: string;
  video: string;
  poster: string;
  /** Larger tile; the first featured clip takes a 2x2 block on wide screens. */
  featured?: boolean;
}
