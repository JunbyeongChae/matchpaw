export interface ChecklistItem {
  id: number;
  checklistId: number;
  content: string;
  isChecked: boolean;
  order: number;
}

export interface Checklist {
  id: number;
  userId: number | null;
  animalId: string;
  title: string;
  createdAt: string;
  items: ChecklistItem[];
}

export interface GeminiChecklistRequest {
  animalId: string;
  animalKind: string;
  animalAge: string;
  animalSpecialMark: string;
}

export interface GeminiChecklistResponse {
  title: string;
  items: {
    content: string;
    order: number;
  }[];
}

export interface CreateChecklistBody {
  animalId: string;
  animalKind: string;
  animalAge: string;
  animalSpecialMark: string;
}

export interface UpdateChecklistItemBody {
  isChecked: boolean;
}
