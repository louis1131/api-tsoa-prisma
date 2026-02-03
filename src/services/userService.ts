import prisma from "../db";
import { userDTO, userResponseDTO, usersListDTO, userUpdateDTO } from "../dto/user";

// Build a type with all proprieties specified
export type UserUpdateParams = Pick<userUpdateDTO, "firstname" | "lastname" | "role_id">;

export class UserService {

    // Retrieves a user by its id.
    // Returns a Promise resolving to a userResponseDTO.
    // Throws an error if the user is not found.
    public async getOne(id: number): Promise<userResponseDTO> {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { role: true }
        });

        if (!user) {
            throw new Error("User not found");
        }

        return {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role.name,
            role_id: user.role_id
        };
    }

    // Retrieves all users.
    // Returns a Promise resolving to a usersListDTO
    public async getAll(): Promise<usersListDTO[]> {
        const users = await prisma.user.findMany({
            include: { role: true }
        });

        return users.map(user => ({
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            email_verification: user.email_verification,
            role: user.role.name,
            role_id: user.role_id
        }));
    }

    // Updates a user by ID. Returns a Promise of the updated user DTO (password excluded).
    // `Omit` is used to prevent exposing the password.
    public async updateOne(id: number, user: userDTO, params: UserUpdateParams): Promise<Omit<userResponseDTO, "password">> {
        const updatedUser = await prisma.user.update({
            where: { id: id},
            data: {
                firstname: params.firstname,
                lastname: params.lastname,
                role_id: params.role_id
            },
            include: { role: true }
        });

        if (!updatedUser) {
            throw new Error ("User not found");
        }

        return {
            id: updatedUser.id,
            email: updatedUser.email,
            firstname: updatedUser.firstname,
            lastname: updatedUser.lastname,
            role: updatedUser.role.name,
        }
    };

    // Deletes a user by ID. Returns an object indicating if deletion succeeded.
    public async deleteOne(id: number, user: userDTO): Promise<{ account_deleted: boolean }> {
        const deleteUser = await prisma.user.delete({
            where: { id: id}
        });

        if (!deleteUser) {
            throw new Error ("User not found");
        }

        return {
            account_deleted: true
        }
    }

    // Returns info about the currently logged-in user.
    // Password is excluded from the returned DTO.
    public async getMe(user: userDTO): Promise<Omit<userResponseDTO, "password">> {
        return {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname
        };
    };

    // Updates the currently logged-in user's firstname and lastname.
    // Returns the updated user DTO (password excluded). Role ID is included.
    public async updateMe(user: userDTO, params: UserUpdateParams): Promise<Omit<userUpdateDTO, "password">> {
        const updatedUser = await prisma.user.update({
            where: { id: user.id},
            data: {
                firstname: params.firstname,
                lastname: params.lastname
            },
            include: { role: true}
        });

        if (!updatedUser) {
            throw new Error ("User not found")
        }

        return {
            id: updatedUser.id,
            email: updatedUser.email,
            firstname: updatedUser.firstname,
            lastname: updatedUser.lastname,
            role_id: updatedUser.role.id
        }
    };
}