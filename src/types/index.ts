export type Experience = {
  href: string;
  title: string;
  description: string;
  icon: "pass" | "heart" | "music" | "quiz" | "history" | "gallery";
};
export type ModerationStatus = "pending" | "approved" | "rejected";
export type CommunityMessage = {
  id: string;
  author: string;
  body: string;
  status: ModerationStatus;
};
export type GalleryMemory = {
  id: string;
  caption: string;
  imageUrl: string;
  status: ModerationStatus;
};
