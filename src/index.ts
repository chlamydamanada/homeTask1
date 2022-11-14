import express, { Request, Response}  from  'express'
import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 5000

const videos = [{
    id	: 1,
    title :	"video1",
    author:	"Cat",
    canBeDownloaded	: false,
    minAgeRestriction :	null,
    createdAt : new Date().toISOString(),
    publicationDate : new Date().toISOString(),
	availableResolutions :	['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
}, {
        id	: 2,
        title :	"video2",
        author:	"Dog",
        canBeDownloaded	: false,
        minAgeRestriction :	null,
        createdAt : new Date().toISOString(),
        publicationDate : new Date().toISOString(),
        availableResolutions :	['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
    }]
const authorError = {
    "errorsMessages": [
        {
            "message": "the author is not correct",
            "field": "author"
        }
    ]
}
const titleError = {
    "errorsMessages": [
        {
            "message": "the title is not correct",
            "field": "title"
        }
    ]
}
const availableResError = {
    "errorsMessages": [
        {
            "message": "the availableResolutions is not correct",
            "field": "availableResolutions"
        }
    ]
}
const canBeError = {
    "errorsMessages": [
        {
            "message": "the availableResolutions is not correct",
            "field": "canBeDownloaded"
        }
    ]
};





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
    const today = new Date();
    const nextDay = new Date(new Date().setDate(new Date().getDate() + 1));
    let newAuthor = req.body.author;
    let newTitle = req.body.title;
    let newResolutions = req.body.availableResolutions;
           if (!newTitle || newTitle.length > 40 || !newTitle.trim() || typeof newTitle !== 'string') {
               res.status(400).send({
                   "errorsMessages": [
                       {
                           "message": "the title is not correct",
                           "field": "title"
                       }
                   ]
               })
               return;
           }
           if (!newAuthor || newAuthor.length > 20 || !newAuthor.trim() || typeof newAuthor !== 'string') {
               res.status(400).send({
                   "errorsMessages": [
                       {
                           "message": "the author is not correct",
                           "field": "author"
                       }
                   ]
               })
               return;
           }
     const newVideo = {
                   id: +(new Date()),
                   title: req.body.title,
                   author: req.body.author,
                   canBeDownloaded: false,
                   minAgeRestriction: null,
                   createdAt: today.toISOString(),
                   publicationDate: nextDay.toISOString(),
                   availableResolutions: req.body.availableResolutions

               }
               if (newVideo) {
                   videos.push(newVideo)
                   res.status(201).send(newVideo)
                   return;
               }


 })

app.put('/videos/:id', (req:Request, res:Response) => {
    const modifiedAuthor : string = req.body.author;
    const modifiedTitle : string = req.body.title;
    if (!modifiedTitle || modifiedTitle.length > 40 || !modifiedTitle.trim() || typeof modifiedTitle !== 'string'){
        res.status(400).send(titleError)
    } else if (!modifiedAuthor || modifiedAuthor.length > 20 || !modifiedAuthor.trim() || typeof modifiedAuthor !== 'string'){
        res.status(400).send(authorError)
        return;
    } else {
        const id = +req.params.id;
    const video = videos.find(v => v.id === id)
       if(video) {
        video.title = req.body.title;
        video.author = req.body.author;
        video.availableResolutions = req.body.availableResolutions;
        video.canBeDownloaded = req.body.canBeDownloaded,
        video.minAgeRestriction = req.body.minAgeRestriction,
        video.publicationDate = req.body.publicationDate
           res.send(204)
           return;
    } else {
           res.send(404)
           return;
       }
}
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

