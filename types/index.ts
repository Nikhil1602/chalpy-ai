import { IconType } from "react-icons"

export type PackageTypes = {
    id: number,
    name: string,
    Icon: IconType
}[];

export type StorageType = 'local' | 'session';
