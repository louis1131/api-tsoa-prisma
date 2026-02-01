// Data Transfer Objects (DTOs) used to define the structure of
// request and response payloads across the API.
// These DTOs help ensure type safety and prevent exposing sensitive data.

export type userDTO = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    role?: string;
}

export type userResponseDTO = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role?: string;
    role_id?: number;
}

export type usersListDTO = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    role_id: number;
};

export type userUpdateDTO = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role_id?: number;
}

export type loginRequestDTO = {
    email: string;
    password: string;
}

export type loginResponseDTO = {
    token: string;
}