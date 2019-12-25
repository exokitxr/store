// Verify user's code, returns boolean.
export const verifyUser = () => {
    return new Promise((accept, reject), async () => {
        try {
            const response = await fetch("URL", {

            })
            if (response) {
                const json = await response.json()
            }
            accept()
        }
        catch (e) {
            console.error(e)
            reject(e)
        }
    })
}

// Login user, returns userData.
export const loginUser = () => {
    return new Promise((accept, reject), async () => {
        try {
            const response = await fetch("URL", {

            })
            if (response) {
                const json = await response.json()
            }
            accept()
        }
        catch (e) {
            console.error(e)
            reject(e)
        }
    })
}