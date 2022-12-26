import { SuccessResponse } from "./Responses";

export interface ActivityResponse extends SuccessResponse{
    results:  ActivityModel[];
}
export interface ActivityModel {
    date_edited:        null;
    title:              string;
    costs:              string;
    author:             Author;
    registration_close: Date;
    no_of_reserve:      number;
    event_date:         Date;
    no_of_entries:      number;
    description:        string;
    photo_url:          null;
    reserve:            any[];
    max_participants:   number;
    organizers:         Organizer[];
    entries:            Entry[];
    id:                 number;
}

export interface Author {
    last_name:   string;
    name:        string;
    first_name:  string;
    middle_name: string;
    id:          number;
}

export interface Entry {
    pub_date:  Date;
    author:    Author;
    payed:     boolean;
    remark:    string;
    activity:  number;
    id:        number;
    showed_up: boolean;
}

export interface Organizer {
    activity: number;
    remark:   string;
    id:       number;
    author:   Author;
}
