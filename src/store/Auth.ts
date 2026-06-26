import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { persist } from "zustand/middleware"

import {AppwriteException, ID, Models} from "appwrite"
import { account } from "@/models/client/config"


export interface UserPrefs{
    reputation: number
}

interface IAuthStore{
    // STATE — data jo store mein rahega
    session: Models.Session | null   // Appwrite session (login info)
    jwt: string | null               // JWT token (API calls ke liye)
    user: Models.User<UserPrefs> | null  // logged in user + uske prefs
    hydrated: boolean                // store ready hai ya nahi

    // ACTIONS — functions jo state change karenge
    setHydrated(): void
    verifySession(): Promise<void>
    login(
        email: string,
        password: string
    ): Promise<
    {
        success: boolean;
        error?: AppwriteException | null
    }>
    createAccount(
        name: string,
        email: string,
        password: string
    ): Promise<
    {
        success: boolean;
        error?: AppwriteException | null
    }>
    logout(): Promise<void>
}

export const useAuthStore = create<IAuthStore>()(
    //persist(stateCreatorFn, persistOptions)
    //persist middleware automatically state ko localStorage me save karta hai.
    persist(
        //immer middleware lets you perform immutable updates.
        //Mutable → same object ko change karna
        //Immutable → new object bana kar change karna
        immer((set)=>({
            session: null,
            jwt: null,
            user: null,
            hydrated: false,

            setHydrated(){
                set({hydrated: true})
            },

            async verifySession(){
                try {
                    const session=await account.getSession("current")
                    set({session})

                } catch (error) {
                    console.log(error)
                }
            },

            async login(email: string,password: string){
                try {
                    const session=await account.createEmailPasswordSession(email,password)
                    const [user,{jwt}]=await Promise.all([
                        account.get<UserPrefs>(),
                        account.createJWT()
                    ])
                    if(!user.prefs?.reputation) await account.updatePrefs<UserPrefs>({
                        reputation: 0
                    })
                    set({session, user, jwt})
                    return {success: true}
                } catch (error) {
                    console.log(error)
                    return{
                        success: false,
                        error: error instanceof AppwriteException? error: null
                    }
                }
            },

            async createAccount(name: string,email: string,password: string){
                try {
                    /*
                    await account.create({
                        userId: '<USER_ID>',
                        email: 'email@example.com',
                        password: '',
                        name: '<NAME>' // optional
                    });
                    */
                    await account.create(
                        ID.unique(),
                        email,
                        password,
                        name
                    )
                    return {success: true}
                } catch (error) {
                    console.log(error)
                    return{
                        success: false,
                        error: error instanceof AppwriteException? error: null
                    }
                }
            },

            async logout(){
                try {
                    await account.deleteSessions()
                    set({session: null, jwt: null, user: null})
                } catch (error) {
                    console.log(error)
                }
            }
        })),
        {
            name: "auth",  // localStorage mein is naam se save hoga
            onRehydrateStorage() {  // jab storage se data load ho raha ho
                return (state, error) => {  // load hone ke baad yeh chalta hai
                    if (!error) state?.setHydrated()  // koi error nahi → hydrated: true
                }
            }
        }
    )
)