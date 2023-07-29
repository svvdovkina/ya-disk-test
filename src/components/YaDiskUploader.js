import { useState } from "react";

const YaDiskUploader = ({LIMIT}) => {
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [completed, setCompleted] = useState(0);
    const [error, setError] = useState(null);

    const getFiles = (e) => {
        setFiles(e.target.files);
        console.log(e.target.files.length)
    }

    const getUploadURL = async (file) => {
        const url = "https://cloud-api.yandex.net/v1/disk/resources/upload";

        const token = document.location.hash.match(/access_token=([^&]+)/)[1];
        //const test_token = 'y0_AgAAAABUqZ5eAApB2AAAAADo4_tdgqcByCZQRaCllpVPTXD3cVhu5AA';
        const authHeader = {'Authorization': `OAuth ${token}`}
        try {
            const data = await fetch(`${url}?path=${file.name}/`, {headers: authHeader});
            const res = await data.json();
            if (res.error) {
                throw new Error(res.message)
            }
            return res
        } catch (error) {
            setError(error.message)
        }
        
    }

    const uploadFile = async (file, href, method) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(href, {
        method: method,
        body: formData
        })
        return response
    }

    const uploadFiles = (e)=>{
        e.preventDefault();
        
        let filesToProcess = Array.from(files);
        if (filesToProcess.length > LIMIT) {
            filesToProcess = filesToProcess.slice(LIMIT)
        }
        filesToProcess.forEach(async (file)=>{
            try {
                setDone(false);
                setLoading(true);
                
                const hrefResp = await getUploadURL(file);
                if (!hrefResp) return
                const {href, method} = hrefResp;
    
                const response = await uploadFile(file, href, method);
                if (response.status === 201) {
                setCompleted(c=>c+1);
                }
                setDone(true);
                
            } catch (error) {
                setError(error.message)
            } finally{
                setLoading(false);
            }
    
        })
        
    }


    if (error) {
        document.location.hash = '';
        const refresh = () => window.location.reload(true)
        
        return <div>
            <h2>There was an error...</h2>
            <p>{error}</p>

            <button onClick={refresh}>Reload</button>

        </div>
    }

    return (
        <>
        <h1>File uploader</h1>
        <p>Please choose up to {LIMIT} files to upload to yandex disk</p>
        <form action="">
            <input type="file"  onChange={getFiles} name="files" id="" multiple/>
            <button type="submit" onClick={uploadFiles}>Upload to Yandex-disk</button>
        </form>
        <h3 className='result'>
            {loading && 'Uploading...'}
            {done && `${completed} files uploaded`}
        </h3>
        {done && <button className="disk-btn"><a href="https://disk.yandex.com/client/disk" target="blank">Check your Disk</a></button>}
        </>
  );
}

export default YaDiskUploader