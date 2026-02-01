import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface GeneralState {
    generalBoolean: Record<string, boolean>
    setGeneralBoolean: (key: string, value: boolean) => void

}

export const useGeneralStore = create<GeneralState>()(
    devtools(
        (set) => ({
            generalBoolean: {},

            setGeneralBoolean: (key, value) =>
                set(
                    (state) => ({
                        generalBoolean: {
                            ...state.generalBoolean,
                            [key]: value,
                        },
                    }),
                    false,
                    `General/setLoading/${key}`
                ),
        }),
        {
            name: 'GeneralStore',
            enabled: process.env.NEXT_PUBLIC_TOOL_ENV === 'true',
        }
    )
)
