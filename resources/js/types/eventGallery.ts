import { User } from "./index";

export type EventGallery = {
    'id': number;
    'image': string;
    'caption': string;
    'user': User;
    'created_at': Date,
    'updated_at': Date
}