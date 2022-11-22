import { SuccessResponse } from "./Responses";

export interface PhotoAlbumResponse extends SuccessResponse {
  results: PhotoAlbum[];
}

export interface PhotoAlbum {
  photographer: string;
  title: string;
  category: string;
  date_edited: Date | null;
  album_date: Date;
  id: number;
  members_only: boolean;
  author: number;
  photos: Photo[];
}

export interface Photo {
  id: number;
  url: string;
  position: number;
  thumb: string;
}
