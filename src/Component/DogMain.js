/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-date-picker';
import { getUrl, dateToString, isEmptyValid, dateFomat, prevMonthYear } from '../Util/util';

class DogMain extends Component {
    constructor(prosp) {
        super(prosp);
        var date = prevMonthYear(3);

        this.root = document.getElementById("root");
        this.state = {
            page : 0,               // 검색페이지
            progress : false,       // 로딩
            upkind : 0,             // 축종코드 - 개 : 417000 - 고양이 : 422400 - 기타 : 429900
            kind : 0,               // 품종
            pageNo : 1,             // 페이지 정보
            sidoorgCd : 0,          // 시도 데이터 num default 전국 - 0
            sidoData : [],          // 시도 데이터
            sigunguorgCd : 0,       // 시군구 데이터 num default 모든지역 - 0
            sigunguData : [],       // 시군구 데이터
            startDate : date,       // 시작 날짜
            endDate : new Date(),   // 종료 날짜
            searchData : [],        // 유기동물 검색 정보  
            kindData : [],          // 품종 데이터      
            reset : false,          // 데이터 초기화     
        }
    }
    async componentDidMount() {
        this.mount = true;
        await this.setState({
            progress : true
        })

        if(!isEmptyValid(window.localStorage.getItem("sido"))) {
            this.setState({
                sidoData : JSON.parse(window.localStorage.getItem("sido"))
            })
        } else {
            await this.getSido();
        }
        this.getSearchData();
        this.root.style.height = window.innerHeight + 'px';
        window.addEventListener('resize', this.resizeHeight, true);
        window.addEventListener("scroll", this.scrollEvent, true);
    }
    componentWillUnmount() {
        this.mount = false;
        window.removeEventListener("scroll", this.scrollEvent);
        window.removeEventListener("resize", this.resizeHeight);
    }

    // 브라우저 높이 조절시 높이값 조정
    resizeHeight = () => {
        this.root.style.height = window.innerHeight + 'px';
    }
    
    // 시도 정보 가져오기
    getSido = async () => {
        axios.post(`${getUrl()}/dog/sido`).then((res) => {
            console.log(res);
            this.setState({
                sidoData : res.data.items.item
            });
            window.localStorage.setItem("sido", JSON.stringify(res.data.items.item));
        });
    }
    // 시군구 정보 가져오기
    getSigungu = (orgCd) => {
        var param = {
            orgCd : parseInt(orgCd)
        };
        axios.post(`${getUrl()}/dog/sigungu`, param).then((res) => {
            console.log(res);
            if (!isEmptyValid(res.data)) {
                this.setState({
                    sigunguData : res.data.items.item
                })
            }
        });
    }
    // 품종 정보 가져오기
    getKind = (upkind) => {
        var param = {
            upkind : upkind
        };
        console.log(param)
        axios.post(`${getUrl()}/dog/kind`, param).then((res) => {
            if (!isEmptyValid(res.data)) {
                console.log(Array.isArray(res.data.items.item))
                if (Array.isArray(res.data.items.item)) {
                    this.setState({
                        kindData : res.data.items.item
                    })
                } else {
                    var array = [];
                    array.push(res.data.items.item);
                    this.setState({
                        kindData : array
                    })
                }
            }
        });
    }
    // 검색 유기동물 정보 가져오기
    getSearchData = async () => {
        var sidoorgCd = '', sigunguorgCd = '', kind = '', upkind = '';
        if (this.state.sidoorgCd != 0) {
            sidoorgCd = this.state.sidoorgCd;
        };
        if (this.state.sigunguorgCd != 0) {
            sigunguorgCd = this.state.sigunguorgCd;
        };
        if (this.state.kind != 0) {
            kind = this.state.kind;
        };
        if (this.state.upkind != 0) {
            upkind = this.state.upkind;
        };
        await this.setState({
            progress : true,
            page : this.state.page + 1
        })
       
        var param = {
            page : this.state.page,
            upkind : upkind,                                    // 축종
            kind : kind,                                        // 품종
            sidoorgCd : sidoorgCd,                              // 시도 데이터 num default 전국 - 0
            sigunguorgCd : sigunguorgCd,                        // 시군구 데이터 num default 모든지역 - 0
            startDate : dateToString(this.state.startDate),     // 시작 날짜
            endDate : dateToString(this.state.endDate)          // 종료 날짜
        };
        console.log(param);
        await axios.post(`${getUrl()}/dog/search`, param).then(async (res) => {
            console.log(res);
            if (!isEmptyValid(res.data)) {
                if(this.state.reset) {
                    await this.setState({
                        searchData : [],
                    })
                }
                this.setState({
                    searchData : [...this.state.searchData, ...res.data.items.item]
                })
            }
        });
        await this.setState({
            progress : false
        })
    }
    // 검색 버튼 클릭
    searchOnClick = async () => {
        await this.setState({
            page : 0,
            reset : true
        })
        document.getElementById("searchData-wrap").scrollTop = 0;
        this.getSearchData();
    }
    scrollEvent = () => {
        const scrollHeight = document.getElementById("searchData-wrap").scrollHeight;
        const scrollTop = document.getElementById("searchData-wrap").scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        // console.log(scrollTop + clientHeight + "/" + scrollHeight)
        if (scrollTop + clientHeight >= scrollHeight && this.state.progress === false) {
            this.setState({
                reset : false
            })
            // this.getSearchData();
        }
    }
    inputOnChange = state => async event => {
        await this.setState({
            [state] : event.target.value
        });

        switch (state) {
            case 'sidoorgCd':
                this.getSigungu(this.state.sidoorgCd);
                break;
            case 'upkind':
                if (this.state.upkind != 0) {
                    this.getKind(this.state.upkind);
                }
                break;
            default:
                break;
        }
    }
    dateOnChange = state => async date => {
        if (state === "startDate") {
            this.setState({
                startDate : date
            });
        };
        if (state === "endDate") {
            this.setState({
                endDate : date
            });
        };
    }
    // 시도 정보 렌더링
    sidoRender = () => {
        return (
            <select value={this.state.sidoorgCd} onChange={this.inputOnChange("sidoorgCd")}>
                <option value={0} key={0}>전 국</option>
                {
                    this.state.sidoData.length > 0 && this.state.sidoData.map((sido, index) => {
                        return <option value={sido.orgCd} key={index + 1}>{sido.orgdownNm}</option>
                    })
                }
            </select>
        )
    }
    // 시군구 정보 렌더링
    sigunguRender = () => {
        if (this.state.sidoorgCd === 0) {
            return (
                <select value={this.state.sigunguorgCd} onChange={this.inputOnChange("sigunguorgCd")}>
                    <option value={0} key={0}>모든지역</option>
                </select>
            )
        } else {
            return (
                <select value={this.state.sigunguorgCd} onChange={this.inputOnChange("sigunguorgCd")}>
                    <option value={0} key={0}>전 체</option>
                    {
                        this.state.sigunguData.length > 0 && this.state.sigunguData.map((sido, index) => {
                            return <option value={sido.orgCd} key={index}>{sido.orgdownNm}</option>
                        })
                    }
                </select>
            )
        }
    }
    // 품종 정보 렌더링
    kindRender = () => {
        if (this.state.upkind === '0') {
            return (
                <select value={this.state.kind} onChange={this.inputOnChange("kind")}>
                    <option value={0}>전 체</option>
                </select>
            )
        } else {
            return (
                <select value={this.state.kind} onChange={this.inputOnChange("kind")}>
                    <option value={0} key={0}>전 체</option>
                    {
                        this.state.kindData.length > 0 && this.state.kindData.map((sido, index) => {
                            return <option value={sido.kindCd} key={index + 1}>{sido.KNm}</option>
                        })
                    }
                </select>
            )
        }
    }
    // 유기동물 조회 렌더링
    happyDogRender = () => {
        function kindCd(kind) {
            if (kind.indexOf('[개]') > -1) {
                return kind.substring(4,kind.length);
            } else if (kind.indexOf('[고양이]') > -1) {
                return kind.substring(6,kind.length);
            } else if (kind.indexOf('[기타축종]') > -1) {
                return kind.substring(1,5);
            }
        }

        return (
            <div id="searchData-wrap" className="searchData-wrap">
                <div className="searchData-content">
                    {
                        this.state.searchData.length > 0 && this.state.searchData.map((hp, index) => {
                            return (
                                <div className="list-data" key={index}>
                                    <div className="img-wrap">
                                        <img src={hp.filename} alt="이미지"/>

                                    </div>
                                    <div className="desc-wrap">
                                        <p>{hp.noticeNo}</p>
                                        <p>{dateFomat(hp.happenDt.toString())}</p>
                                        <p>{kindCd(hp.kindCd)}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
    render() {
        return (
            <>
                <div className={`progress ${this.state.progress ? 'block' : 'none'}`}><p>loading</p></div>
                <div className="search-wrap">
                    <div className="search-img-wrap"></div>
                    <div className="search">
                        <div className="select-kind-wrap">
                            <select value={this.state.upkind} onChange={this.inputOnChange("upkind")}>
                                <option value={0}>전 체</option>
                                <option value={'417000'}>강아지</option>
                                <option value={'422400'}>고양이</option>
                                <option value={'429900'}>기 타</option>
                            </select>
                            {this.kindRender()}
                        </div>
                        <div className="select-sido-wrap">
                            {this.sidoRender()}
                            {this.sigunguRender()}
                        </div>
                        <div className="select-date-wrap">
                            <DatePicker onChange={this.dateOnChange("startDate")} value={this.state.startDate} format="yy-MM-dd"/>
                            <DatePicker onChange={this.dateOnChange("endDate")} value={this.state.endDate} format="yy-MM-dd"/>
                        </div>
                    </div>
                    <button className="search-button" onClick={this.searchOnClick}>검색</button>
                </div>
                <div className="result-wrap">
                    {this.happyDogRender()}
                </div>
                <div className="footer">

                </div>
            </>
        );
    }
}

export default DogMain;