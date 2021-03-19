const imageUpload = document.getElementById('imageUpload')

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    ]).then(start)

async function start(){
    const container = document.createElement('div')
    container.style.position = 'relative'
    document.body.append(container)
    const labeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    let image, canvas

    document.body.append('ทรงจมูกที่หลายคนต้องการ แต่การจะอยู่บนหน้าแล้วสวยเป็นธรรมชาติ  คนนั้นต้องมีเครื่องหน้าที่ครบพอสมควรเพราะด้วยลักษณะที่จะเป็นสันมาตั้งแต่ระหว่างคิ้วและโด่งมาถึงปลายที่เป็นหยดน้ำ โดยถ้าอยากทำจมูกทรงนี้ ผู้ทำจะต้องเป็นคนที่มีเนื้อจมูกค่อนข้างเยอะ จึงเหมาะกับคนที่มีจมูกโด่งอยู่แล้วพอสมควร เหมาะกับ : คนที่มีสันจมูก หน้ารูปไข่ และ มีเนื้อจมูกที่เยอะ')

    imageUpload.addEventListener('change', async () => {
        if (image) image.remove()
        if (canvas) canvas.remove()
        image = await faceapi.bufferToImage(imageUpload.files[0])
        container.append(image)
        canvas = faceapi.createCanvasFromMedia(image)
        container.append(canvas)
        const displaySize = { width: image.width, height: image.height }
        faceapi.matchDimensions(canvas, displaySize)
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
            drawBox.draw(canvas)
          })
    })
}

function loadLabeledImages() {
    const labels = ['จมูกทรงโด่งปลายหยดน้ำ']
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 4; i++) {
                const img = await faceapi.fetchImage(`D:/โปรเจค/FaceRegJS-master/FaceRegJS-master/labeled_images${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
              }
                
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}
//const img = await faceapi.fetchImage(`D:/โปรเจค/FaceRegJS-master/FaceRegJS-master/labeled_images${label}/${i}.jpg`)