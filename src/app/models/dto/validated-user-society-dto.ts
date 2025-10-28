import { ValidatedUserSociety } from "../old/validated-user-society";

export class ValidatedUserSocietyDTO {

    fromResponse(response: any): ValidatedUserSociety {
        return {
            idUser: response.idUser,
            emailUser: response.emailUser,
            prenomUser: response.prenomUser,
            nomUser: response.nomUser,
            telUser: response.telUser,
            employeeId: response.employeeId,
            labelActivitySociety: response.labelActivitySociety,
            idSite: response.idSite,
            postId: response.postId,
            postRanges: response.postRanges,
            labelSite: response.labelSite,
            verified: response.verified,
            departureAddress: response.departureAddress
        }
    }
}