import Cors from 'cors'

const cors =  Cors({
    origin: ["https:\/\/(.*\.)?holaplex\.com", "https://localhost:5000"]
})

export default cors
