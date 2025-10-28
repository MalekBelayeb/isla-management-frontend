export interface User {
    societyId: string,
    firstname: string,
    lastname: string,
    webSite: string,
    email: string,
    societyName: string,
    societyLogo: string,
    siteName?: string
    type: 'admin' | 'responsible'
}