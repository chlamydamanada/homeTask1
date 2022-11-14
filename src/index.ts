import express, { Request, Response}  from  'express'
import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 5000

const videos = [{
    id	: 1,
    title :	"video1",
    author:	"Cat",
    canBeDownloaded	: false,
    minAgeRestriction :	16,
    createdAt : new Date().toISOString(),
    publicationDate : new Date().toISOString(),
	availableResolutions :	['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
}, {
        id	: 2,
        title :	"video2",
        author:	"Dog",
        canBeDownloaded	: false,
        minAgeRestriction :	5,
        createdAt : new Date().toISOString(),
        publicationDate : new Date().toISOString(),
        availableResolutions :	['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
    }];
const validResolutions =['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.get('/', (req:Request, res:Response) => {
    res.send(`Hello user`)
})
app.get('/videos', (req:Request, res:Response) => {
    res.send(videos)
})
app.get('/videos/:id', (req:Request, res:Response) => {
       let video = videos.find(v=> v.id === +req.params.id)
    if (video){
        res.send(video)
    } else {
        res.send(404)
    }
    })

app.delete('/testing/all-data', (req:Request, res:Response) => {
    videos.splice(0,videos.length);
    res.send(204)
 })
app.delete('/videos/:id', (req:Request, res:Response) => {
    for (let i = 0; i < videos.length; i++){
        if (videos[i].id === +req.params.id){
            videos.splice(i,1)
            res.send(204)
            return;
        }
     }
    res.send(404)
})


app.post('/videos', (req:Request, res:Response) => {

    let error :  { "errorsMessages":any[] } = { "errorsMessages": [ ]} ;
    let newAuthor : string = req.body.author;
    let newTitle : string = req.body.title;
    let newResolutions = req.body.availableResolutions;

     if (!newTitle || newTitle.length > 40 || !newTitle.trim() || typeof newTitle !== 'string') {
      error.errorsMessages.push({ "message": "the title is not correct", "field": "title"})
      }
     if (!newAuthor || newAuthor.length > 20 || !newAuthor.trim() || typeof newAuthor !== 'string') {
      error.errorsMessages.push({ "message": "the title is not correct", "field": "author"})
      }

     if(Array.isArray(newResolutions) && newResolutions.length < 1) {
         error.errorsMessages.push({ "message": "the availableResolutions should be an array", "field": "availableResolutions"})
     }
    if (newResolutions.length > 0) {
        for (let i = 0; i < newResolutions.length; i ++ ){
        const  isInclud =  validResolutions.includes(newResolutions[i]);
        if (!isInclud){
            error.errorsMessages.push({ "message": "the availableResolutions is not correct", "field": "availableResolutions"})
            break;
        }
        }
    }

    if(error.errorsMessages.length){
        res.status(400).send(error)
        return;
    }
     const today = new Date();
     const nextDay = new Date(new Date().setDate(new Date().getDate() + 1));
     const newVideo : any = {
                   id: +(new Date()),
                   title: newTitle,
                   author: newAuthor,
                   canBeDownloaded: false,
                   minAgeRestriction: null,
                   createdAt: today.toISOString(),
                   publicationDate: nextDay.toISOString(),
                   availableResolutions: newResolutions
     }
        videos.push(newVideo)
        res.status(201).send(newVideo)
        return;
})

app.put('/videos/:id', (req:Request, res:Response) => {
    let modifiedAuthor : string = req.body.author;
    let modifiedTitle : string = req.body.title;
    let modifiedDownload : boolean = req.body.canBeDownloaded;
    let modifiedAge = req.body.minAgeRestriction;
    let modifiedDate : string = req.body.publicationDate
    let error :  { "errorsMessages":any[] } = { "errorsMessages": [ ]} ;
    if (!modifiedTitle || modifiedTitle.length > 40 || !modifiedTitle.trim() || typeof modifiedTitle !== 'string'){
        error.errorsMessages.push({ "message": "the title is not correct", "field": "title"})
    }
    if (!modifiedAuthor || modifiedAuthor.length > 20 || !modifiedAuthor.trim() || typeof modifiedAuthor !== 'string'){
        error.errorsMessages.push({ "message": "the author is not correct", "field": "author"})
    }
    if (typeof modifiedDownload !== "boolean"){
        error.errorsMessages.push({ "message": "the canBeDownloaded is not correct", "field": "canBeDownloaded"})
    }
    if (typeof modifiedAge !== "number"|| modifiedAge > 18 ){
        error.errorsMessages.push({ "message": "the minAgeRestriction is not correct", "field": "minAgeRestriction"})
    }
    if (typeof modifiedDate !== "string") {
        error.errorsMessages.push({"message": "the publicationDate is not correct", "field": "publicationDate"})
    }
    if(error.errorsMessages.length){
        res.status(400).send(error)
        return;
    }
    const id = +req.params.id;
    const video = videos.find(v => v.id === id)
       if(video) {
        video.title = modifiedTitle,
        video.author = modifiedAuthor,
        video.availableResolutions = req.body.availableResolutions,
        video.canBeDownloaded = modifiedDownload,
        video.minAgeRestriction = modifiedAge,
        video.publicationDate = modifiedDate
           res.send(204)
           return;
    } else {
           res.send(404)
           return;
       }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

