import { SuccessResponse } from "./Responses";

export interface SpamResponse extends SuccessResponse {
  results: ChatItem[];
}

export interface ChatItem {
  id: number;
  pub_date: Date;
  author: Author;
  text: string;
}

export interface Author {
  frust_count: number;
  name: string;
  id: number;
  spam_count: number;
  photo_url: string;
}
