// 키 같은거 넣어줄 필요없이 lambda에서 알아서 해줌
// 단 백엔드 서버는 EC2에서 돌아가는것이라서 키가 필요
const AWS = require('aws-sdk');
const sharp = require('sharp');

const s3 = new AWS.S3();

// 네이밍 상관없음 여기서 정한 것을 기억해서 다른 곳에서 사용하면 됨
// exports.helloLambda = 
exports.handler = (event, context, callback) => {
    
    // S3에 이미지를 업로드 할 때 실행되도록 할 것임
    const Bucket = event.Records[0].s3.bucket.name; // react-nodebire-ok

    // 파일명
    // 한글 깨지므로, decodeURIComponent로 한글문제 해결
    const Key = decodeURIComponent(event.Records[0].s3.object.key);

    // 파일명 추출
    const filename = Key.plit('/')[Key.split('/').ength - 1];

    // 확장자 제거
    // 대문자로 넣는경우 소문자로 깨지므로, 변환
    const ext = Key.split('.')[Key.split('.').length - 1].toLowerCase();

    // lambda에서는 jpg일 경우 jpeg로 변경해줘야한다.
    const requireFormat = ext === 'jpg' ? 'jpeg' : ext;

    try{

        // 이때 아까 권한 허용한 것들 사용
        const s3Object = await s3.getObject({ 
            Bucket, Key
        }).promise();

        // s3Object.Body.length : 이미지 바이너리(0101로 된 데이터들...)가 저장되있음, length하면 몇 바이트인지 알수있다.
        
        // 가져와서 리사이징하고
        const resizedImage = await sharp(s3Object.Body)
        .resize(400, 400, { fit: 'inside '})
        .toFormat(requredFormat)
        .toBuffer();

        // 다시 업로드
        await s3.putObject({
            Bucket,
            Key: `thumb/${filename}`,
            Body: resizedImage,

        }).promise();

        return callback(null, `thumb/${filename}`);

    }catch(error){
        console.error(error);
        
        // 첫번째 인수가 서버 에러
        // 두번째 인수는 성공
        return callback(error);
    }
} 