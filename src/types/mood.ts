export type MoodRating = 1 | 2 | 3 | 4 | 5;

export type MoodEntry = {
  id: string;
  date: string;     
  rating: MoodRating;
  note: string;
  energy?: number;  
  stress?: number;  
  emotions?: string[];
  activities?: string[];
};
