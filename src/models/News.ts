import { SuccessResponse } from "./Responses";

export interface NewsResponse extends SuccessResponse {
  results: NewsArticle[];
}

export interface NewsArticle {
  ser_item: boolean;
  content: string;
  comments: any[];
  subtitle: null | string;
  id: number;
  members_only: boolean;
  author: Author;
  attachment_url: null | string;
  on_top: boolean;
  boardmessage: boolean;
  on_behalf: string;
  title: string;
  photo_url: null | string;
  attachment_file_type: null | string;
  date_edited: Date | null;
  pub_date: Date;
}

export interface Author {
  name: string;
  first_name: string;
  id: number;
  last_name: string;
  middle_name: string;
}
