import { SuccessResponse } from "./Responses";

export interface ActivityResponse extends SuccessResponse{
    results:  ActivityModel[];
}

export interface ActivityModel {
    description:        string;
    max_participants:   number;
    author:             Author;
    entries:            Entry[];
    no_of_reserve:      number;
    event_date:         Date;
    no_of_entries:      number;
    title:              string;
    reserve:            any[];
    photo_url:          null;
    registration_close: Date;
    id:                 number;
    costs:              string;
    date_edited:        null;
}

export interface Author {
    last_name:   string;
    name:        string;
    first_name:  string;
    id:          number;
    middle_name: string;
}


export interface Entry {
    remark:   string;
    author:   Author;
    pub_date: Date;
    activity: number;
    id:       number;
}
