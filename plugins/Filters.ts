export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide:{
            dateFilter:(date:string) => (new Date(date).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true // Use 12-hour format with AM/PM
              })),
        }
    };
})
