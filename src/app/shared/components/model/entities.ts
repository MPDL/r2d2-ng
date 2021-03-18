export interface ESTO<T> {
    _id: string;
    _version: number;
    _seq_no: number;
    _primary_term: number;
    _source: T;
}

export interface ITO<T> {
    id: string;
    source: T;
}

export interface DatasetVersion {
    id: string;
    creationDate: string;
    modificationDate: string;
    creator: User;
    modifier: User;
    versionNumber: number;
    state: 'PRIVATE' | 'PUBLIC' | 'WITHDRAWN';
    publicationDate?: string;
    metadata: Metadata;
    files?: R2D2File[];
    dataset: Dataset;
  }

export interface Dataset {
    id: string;
    creationDate: string;
    modificationDate: string;
    creator: User;
    modifier: User;
    state: 'PRIVATE' | 'PUBLIC' | 'WITHDRAWN';
    datamanager?: User[];
}

export interface User {
    id: string;
    name: string;
}

export interface UserAccount {
    id: string;
    creationDate: string;
    modificationDate: string;
    creator: User;
    modifier: User;
    email: string;
    active: boolean;
    person: Person;
    grants: Grant[];
}

export enum Role {
    admin = 'ADMIN',
    user = 'USER',
    datamanager = 'DATAMANAGER',
    deleteadmin = 'DELETEADMIN',
}

export interface Grant {
    role: Role;
    dataset: string;
}

export interface Person {
    givenName: string;
    familyName: string;
    orcid?: string;
    affiliations?: Affiliation[];
}

export interface Affiliation {
    id?: string;
    organization?: string;
    department?: string;
}

export interface Publication {
    title: string;
    url?: string;
    type?: string;
    identifier?: string;
    identifierType?: string;
}
export interface License {
    name: string;
    url?: string;
}

export interface Metadata {
    title: string;
    authors?: Person[];
    doi?: string;
    description?: string;
    genres?: string;
    keywords?: string;
    license?: License;
    language?: string;
    correspondingPapers?: Publication[];
}

export interface R2D2File {
    id: string;
    state?: 'INITIATED' | 'ONGOING' | 'COMPLETE' | 'ATTACHED' | 'PUBLIC';
    stateInfo?: FileUploadStatus;
    filename?: string;
    storageLocation?: string;
    checksum?: string;
    format?: string;
    size?: number;
}

export interface FileChunk {
    number: number;
    clientEtag?: string;
    serverEtag?: string;
    progress: 'IN_PROGRESS' | 'COMPLETE';
    size?: number;
}

export interface FileUploadStatus {
    currentChecksum?: string;
    expectedNumberOfChunks?: number;
    chunks?: FileChunk[];
}

export interface SearchResult<T> {
    total: number;
    hits: ITO<T>[];
}

export interface ESResult<T> {
    hits: {
        total: {
            value: number;
        };
        hits: ESTO<T>[];
    };
}
