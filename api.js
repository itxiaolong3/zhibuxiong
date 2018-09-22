var _api_root = '{$_api_root}';
var api = {
  root: _api_root,
  index: {
    getbanner: _api_root + 'getbanner',
    gethotgushi: _api_root + 'getgushilist&hot=1',
    getgushi: _api_root + 'getgushilist',
    getshoucang: _api_root + 'getshoucang',
    getreadshoucang: _api_root + 'Getreadshoucang',
    gethotuser: _api_root + 'gethotuser',
    gethotread: _api_root + 'Gethotread',
    pian: _api_root +'getpian',
    shareimg: _api_root + 'getshareimg',
    getad: _api_root + 'getad'
  },
  speak: {
    uploadimg: _api_root + 'Postuploadimg1',
    uploadaudio: _api_root + 'Postuploadaudio',
    uploadgushi: _api_root + 'Postgushi'
  },
  user: {
    savauserinfo: _api_root + 'postuser',
    getuserinfo: _api_root + 'Getuserinfo',
    updateuserinfo: _api_root + 'updateuser',
  },
  gallery: {
    gettuku: _api_root + 'gettuku',
    getfenlei: _api_root + 'GetTukufenlei'
  },
  feedback: {
    feedback: _api_root + 'Postliuyuan'
  },
  music: {
    getbgmusic: _api_root + 'Getbjmusic'
  },
  story: {
    getstoryone: _api_root + 'getgushi',
    changeshoucang: _api_root + 'changeshoucang',
    dogood: _api_root + 'dogood',
    gethotgushi: _api_root + 'getgushilist',
    getqrcode: _api_root + 'Getqrcode',
    getafterqrcode: _api_root + 'Getshareafter',
    getpersonstory: _api_root + 'Getpersonlist',
    postpinlun: _api_root + 'postpinlun',
    getgushipinlun: _api_root +'Getgushipinlun',
    postshouting: _api_root +'Postshouting',
    dodelete:_api_root+'Postdelete',
    doisprivate: _api_root +'Doisprivate'
  },
  read: {
    getstoryone: _api_root + 'Getoneread',
    getaudioone: _api_root + 'Getreaddetail',
    uploadgushi: _api_root + 'Postreadgushi',
    dogood: _api_root + 'doreadgood',
    getallreadlist: _api_root + 'Getallreadgushi',
    gettypereadlist: _api_root + 'Getreadgushilist',
    getpersonstory: _api_root + 'Getmyreadgushi',
    getactivit: _api_root + 'Getactivit',
    getactivitdetail: _api_root + 'Getactivitdetail',
    postshouting: _api_root +'Postshoutingread',
    getgushiread: _api_root + 'getgushiread',
    getqrcoderead: _api_root + 'Getqrcoderead',
  }
};
module.exports = api;