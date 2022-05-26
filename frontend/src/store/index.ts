import create from 'zustand';


interface UserState {
    users: user[];
    setUsers: (users: Array<user>) => void;
    editUser: (user: user, newUsername: string) => void;
    removeUser: (user: user) => void;
}

const useStore = create<UserState>((set) => ({
    users: [],

    setUsers: (users: Array<user>) => set(() => {
        return {users: users}
    }),

    editUser: (user: user, newUsername) => set((state) => {
        return {users: state.users.map(u => u.id === user.id ?
                ({...u, username: newUsername} as user): u)}
    }),

    removeUser: (user: user) => set((state) => {
        return {users: state.users.filter(u => u.id !==
                user.id)}
    })
}))

export const useUserStore = useStore;