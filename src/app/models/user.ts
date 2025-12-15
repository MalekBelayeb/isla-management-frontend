export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  societyId: string;
  societyLogo: string;
  societyName: string;
  type: 'admin' | 'agent';
  webSite: string;
}
