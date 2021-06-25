import Cors from 'cors'

const cors =  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
})

export default cors
