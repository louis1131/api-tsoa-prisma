export type userDTO = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    password: string;
}

export interface userResponseDTO {
    id: number;
    email: string;
}

export interface usersListDTO {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
};

export type loginRequestDTO = {
    email: string;
    password: string;
}

export type loginResponseDTO = {
    token: string;
}