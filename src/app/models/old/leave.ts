export interface Leave {
    id: string,
    idUser: string,
    leaveType: string,
    daysRequested: number,
    startDate: Date,
    endDate: Date,
    creationDate: Date
}