// Send verifcation email, returns if successful.
export const sendVerifyCode = (email) => {
    const url = `https://login.exokit.org/?email=${encodeURIComponent(email)}`
    return new Promise(async (accept, reject)  => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors'
            })
            if (response.ok) {
                accept(true)
            }
        }
        catch (e) {
            console.error(e)
            reject(e)
        }
    })
}

// Verify user's code, returns userData and token.
export const verifyCode = (email, verificationCode) => {
    const url = `https://login.exokit.org/?email=${encodeURIComponent(email)}&code=${encodeURIComponent(verificationCode)}`
    return new Promise(async (accept, reject)  => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors'
            })
            if (response.ok) {
                const json = await response.json()
                accept(json)
            }
        }
        catch (e) {
            console.error(e)
            reject(e)
        }
    })
}

// Login user, returns userData.
export const loginUser = () => {
    return new Promise(async (accept, reject) => {
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