var express = require("express");
var axios = require("axios");
var app = express();
const bodyParser = require('body-parser');
const url = "http://openapi.animal.go.kr/openapi/service/rest/abandonmentPublicSrvc/";
var serviceKey = "jxdNXHd7MviV0OG96kcvMLDsmrrUH4VJcJ5gizCALgi1jMmyz5tA4sJ3PCByGqHd381IPz3UCtTCnGuX0dOZgQ%3D%3D";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 시도 정보 가져오기 restApi
app.post("/dog/sido", async (req, res) => {
    var sidoData;
    await axios.default.get(`${url}sido?serviceKey=${serviceKey}&&numOfRows=20`).then((res) => {
        sidoData = res.data.response.body;
    });
    
    res.send(sidoData);
});

// 시군구 정보 가져오기 restApi
app.post("/dog/sigungu", async (req, res) => {
    var orgCd = req.body.orgCd;
    var sigunguData;
    await axios.default.get(`${url}sigungu?upr_cd=${orgCd}&serviceKey=${serviceKey}`).then((res) => {
        sigunguData = res.data.response.body;
    });
    
    res.send(sigunguData);
});
// 품종 정보 가져오기 restApi
app.post("/dog/kind", async (req, res) => {
    var up_kind = req.body.upkind;
    var kindData;

    await axios.default.get(`${url}kind?up_kind_cd=${up_kind}&serviceKey=${serviceKey}`).then((res) => {
        kindData = res.data.response.body;
    });
    
    res.send(kindData);
});
// 유기동물 검색 정보 가져오기 restApi
app.post("/dog/search", async (req, res) => {
    var page = req.body.page;
    var upkind = req.body.upkind;
    var kind = req.body.kind;
    var upr_cd = req.body.sidoorgCd;
    var org_cd = req.body.sigunguorgCd;
    var bgnde = req.body.startDate;
    var endde = req.body.endDate;
    var searchData;

    await axios.default.get(`${url}abandonmentPublic?upkind=${upkind}&kind=${kind}&upr_cd=${upr_cd}&org_cd=${org_cd}&bgnde=${bgnde}&endde=${endde}&pageNo=${page}&numOfRows=20&serviceKey=${serviceKey}`).then((res) => {
        searchData = res.data.response.body;
    });
    
    res.send(searchData);
});

var server = app.listen(21389, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log(`Open Server ${host}:${port}`)
});