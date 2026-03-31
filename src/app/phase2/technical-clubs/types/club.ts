export interface CoreMember {
  name: string;
  role: string;
  domain: string;
  image?: string;
}

export interface ClubActivity {
  title: string;
}

export interface ClubProject {
  title: string;
  description: string;
}

export interface Club {
  name: string;
  tagline: string;
  description: string;
  activities: ClubActivity[];
  coreMembers: CoreMember[];
  projects: ClubProject[];
}
