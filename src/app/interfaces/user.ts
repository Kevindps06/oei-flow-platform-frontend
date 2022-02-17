import { SafeUrl } from "@angular/platform-browser";

export class User {
  displayName!: string;
  givenName!: string;
  mail!: string;
  avatar!: SafeUrl | string;
}
