export async function HandleUsers(item){
    try{
        const res = await fetch('/api/user',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({insert_data:item})
        })
        const result = await res.json()
        // console.log({result})

        // console.log(result.result)
        return result.result
    }
    catch(error){
        console.log(error)
    }
}
