import { Component, OnInit,Input } from '@angular/core';
import {AlertController,LoadingController, MenuController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from '@ionic/storage-angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import {UserService} from "../../service/user.service";
import {ChatService} from "../../service/chat.service";
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
declare var resolveLocalFileSystemURL: any;
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  standalone: false,
})
export class TemplateComponent  implements OnInit {
@Input() number: string | any;
public returnResultTempForUsers:any;
public returnArrayTempForUsers:any;
public returnTempForUsers:any = []; 
public returnArrayTempForUsersCompo:any;
public returnTempForName:any = [];
public selectedTempInformation:any = [];
public countOfInput:any = [];
public showTextArray:any = 0;
public showTextArrayVal:any;
public showTextArrayValGen:any;
public showAddFileArray:any = 0;
public format:any;
public showInputArray:any = 0;
public showInputArrayVal:any=[];
public showTextArrayHeaderVal:any = "";
public showTextArrayFooterVal:any = "";
public showTextButtons:any = 0;
public showButtonsArrayVal:any=[];
public countOfButtons:any = [];
public add_number_butt:any;
public showInputArrayValAdd:any = [];
public allDataOfMessages:any;
public allDataOfMessagesMsg:any;
public returnResultDataBySession:any;
public linkType:any;
public imgLink:any;
public filedata:any="";
public nameOfTem:any;
public languageOfTem:any;
public arraySendToServer:any = [];
public dir:any;
public templates_list:any;
//check login
public genaratedFullDate:any;
public genaratedDate:any;
public year:any;
public month:any;
public day:any;
public hour:any;
public minutes:any;
public seconds:any;
public mainUserName:any;
public userName:any;
public password:any;
public apiKey:any;
public sessionLogin:any;
public department:any;
public supervisor:any;
public name:any;
public isScroolTo:any=2;
public countOfNewMsg:any=0;
//page setting
public checkLanguage: any=0;
public language: any;
public menuDirection: any;
public menuDirectionTow: any;
public showPassword: boolean = false;
constructor(private androidPermissions: AndroidPermissions,private chooser: Chooser,private transfer: FileTransfer,private camera: Camera,private chatService: ChatService,private alertController:AlertController,private router: Router,private userService: UserService,private globalization: Globalization, private translate: TranslateService,private modalController: ModalController,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) {
  this.platform.backButton.subscribeWithPriority(10, () => {
    this.modalController.dismiss({
      "key":0
    })
  });
}
  async initialiseTranslation(){
    this.translate.get('menuDirection').subscribe((res: string) => {
      this.menuDirection = res;
    });
    this.translate.get('menuDirectionTow').subscribe((res: string) => {
      this.menuDirectionTow = res;
    });
    this.translate.get('add_number_butt').subscribe((res: string) => {
      this.add_number_butt = res;
    });
    this.translate.get('dir').subscribe((res: string) => {
      this.dir = res;
    });
    this.translate.get('templates_list').subscribe((res: string) => {
      this.templates_list = res;
    });
  }
  async ngOnInit() {
    await this.getDeviceLanguage();
    await this.checkLoginUser();
    let currentDate = new Date();
    this.year = currentDate.getFullYear();
    this.month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
    this.day = currentDate.getDate();
    if(this.month<10)
      this.month = '0'+ this.month;
    if(this.day<10)
      this.day = '0'+ this.day;
    this.genaratedDate = this.year+""+this.month+""+this.day;
    await this.functiongetTempForUsers();
  }
  functiongetTempForUsers(){
    let key = this.mainUserName+this.userName+this.password+"(OLH)"+this.genaratedDate;
    const md5Hash = CryptoJS.algo.MD5.create();
    md5Hash.update(key);
    this.apiKey = md5Hash.finalize();
    this.apiKey=this.apiKey.toString();
    let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey};
    this.userService.chatGetTemplate(sendValues).then(async dataReturn=>{
      this.returnResultTempForUsers = dataReturn;
      let errorData = this.returnResultTempForUsers.messageId;
      if(errorData == 1){
        let count=0;
        this.returnTempForUsers=[];
        this.returnTempForName=[];
        this.returnArrayTempForUsers = this.returnResultTempForUsers.data.waba_templates;
        const length = Object.keys(this.returnArrayTempForUsers).length;
        let i = 0;
        Object.keys(this.returnArrayTempForUsers).forEach(async key => {
          if(this.returnArrayTempForUsers[key].category != "AUTHENTICATION"){
            this.returnTempForUsers[i] = [];
            this.returnTempForName[i] = [];
            this.returnTempForName[i]['name'] = this.returnArrayTempForUsers[key].name;
            this.returnTempForName[i]['language'] = this.returnArrayTempForUsers[key].language;
            this.returnArrayTempForUsersCompo = this.returnArrayTempForUsers[key].components;
            for(let j = 0; j < this.returnArrayTempForUsersCompo.length;j++){
              this.returnTempForUsers[i][j] = [];
              this.returnTempForUsers[i][j]['typeUse']= '0';
              //inside all
              if(typeof this.returnArrayTempForUsersCompo[j].example!== 'undefined'){
                if(typeof this.returnArrayTempForUsersCompo[j].example.body_text!== 'undefined'){
                  if(this.returnArrayTempForUsersCompo[j].example.body_text[0].length!=0){
                    count=0;
                    this.countOfInput=[];
                    for(let jj = 0; jj < this.returnArrayTempForUsersCompo[j].example.body_text[0].length;jj++){
                      this.countOfInput[jj]=[];
                        if(this.returnArrayTempForUsersCompo[j].example.body_text[0][jj]!=null && this.returnArrayTempForUsersCompo[j].example.body_text[0][jj]!="" && this.returnArrayTempForUsersCompo[j].example.body_text[0][jj]!=undefined){
                          this.countOfInput[jj]['val'] = "{{"+this.returnArrayTempForUsersCompo[j].example.body_text[0][jj]+"}}";
                          count++;
                        }
                    }
                    this.returnTempForUsers[i][j]['val']= this.countOfInput;
                    this.returnTempForUsers[i][j]['typeUse']= '1';
                    this.returnTempForUsers[i][j]['countInput']=  count;
                  }
                }
                if(typeof this.returnArrayTempForUsersCompo[j].example.header_handle!== 'undefined'){
                  if(this.returnArrayTempForUsersCompo[j].example.header_handle[0]!=null && this.returnArrayTempForUsersCompo[j].example.header_handle[0]!="" && this.returnArrayTempForUsersCompo[j].example.header_handle[0]!=undefined){
                    this.returnTempForUsers[i][j]['hand']= this.returnArrayTempForUsersCompo[j].example.header_handle[0];
                    this.returnTempForUsers[i][j]['typeUse']= '2';
                    this.returnTempForUsers[i][j]['countInput']=  0;
                  }
                }
              }
              if(typeof this.returnArrayTempForUsersCompo[j].buttons!== 'undefined'){
                this.countOfButtons=[];
                for(let jjj = 0; jjj < this.returnArrayTempForUsersCompo[j].buttons.length;jjj++){
                  this.countOfButtons[jjj]=[]
                  this.countOfButtons[jjj]['text'] = this.returnArrayTempForUsersCompo[j].buttons[jjj].text;
                  this.countOfButtons[jjj]['type'] = this.returnArrayTempForUsersCompo[j].buttons[jjj].type;
  
                }
                this.returnTempForUsers[i][j]['buttons'] = this.countOfButtons;
                this.returnTempForUsers[i][j]['typeUse']= '3';
              }
              if(typeof this.returnArrayTempForUsersCompo[j].format!== 'undefined'){
                this.returnTempForUsers[i][j]['format']=  this.returnArrayTempForUsersCompo[j]['format'];
              }
              if(typeof this.returnArrayTempForUsersCompo[j].text!== 'undefined'){
                this.returnTempForUsers[i][j]['text']=  this.returnArrayTempForUsersCompo[j]['text'];
              }
              this.returnTempForUsers[i][j]['type']=  this.returnArrayTempForUsersCompo[j]['type'];
            }
            i++;
          }
        });
        await this.selectTempNameSelected(0);
      }
    }).catch(error=>{
      this.functiongetTempForUsers()
    });
  }
  async checkLoginUser(){
    this.mainUserName = await this.storage.get('mainUserName');
    this.userName = await this.storage.get('userName');
    this.password = await this.storage.get('password');
    this.apiKey = await this.storage.get('apiKey');
    this.sessionLogin = await this.storage.get('sessionLogin');
    this.department = await this.storage.get('department');
    this.supervisor = await this.storage.get('supervisor');
    this.name = await this.storage.get('name');
    if(this.mainUserName == null || this.userName == null || this.password == null || this.apiKey == null || this.sessionLogin == null || this.department == null || this.supervisor == null || this.name == null){
      this.storage.remove('mainUserName');
      this.storage.remove('userName');
      this.storage.remove('password');
      this.storage.remove('apiKey');
      this.storage.remove('sessionLogin');
      this.storage.remove('department');
      this.storage.remove('supervisor');
      this.storage.remove('name');
      this.navCtrl.navigateRoot('login');
    }
  }
  async getDeviceLanguage() {
    await this.storage.get('checkLanguage').then(async checkLanguage=>{
      this.checkLanguage = checkLanguage
    });
    if(this.checkLanguage){
      this.translate.setDefaultLang(this.checkLanguage);
      this.language = this.checkLanguage;
      this.translate.use(this.language);
      this.initialiseTranslation();
    }else{
      if (window.Intl && typeof window.Intl === 'object') {
        let Val  = navigator.language.split("-");
        this.translate.setDefaultLang(Val[0]);
        if (Val[0] == "ar" || Val[0] == "en")
          this.language = Val[0];
        else
          this.language = 'en';
        this.translate.use(this.language);
        this.initialiseTranslation();
      }
      else{
        this.globalization.getPreferredLanguage().then(res => {
          let Val  = res.value.split("-");
          this.translate.setDefaultLang(Val[0]);
          if (Val[0] == "ar" || Val[0] == "en")
            this.language = Val[0];
          else
            this.language = 'en';
          this.translate.use(this.language);
          this.initialiseTranslation();
        }).catch(e => {console.log(e);});
      }
    }
  }
  functionClosePage(){
    this.modalController.dismiss({})
  }
  functionAddVal(event:any,index:any,val:any){
    this.showInputArrayValAdd[index]=[];
    if(!event.target.value){
      this.showInputArrayValAdd[index]['val'] = val;
      this.showInputArrayValAdd[index]['replaval'] = val;
    }else{
      this.showInputArrayValAdd[index]['val'] = event.target.value;
      this.showInputArrayValAdd[index]['replaval'] = val;
    }
    this.arraySendToServer[index] = this.showInputArrayValAdd[index]['val']
  }
  functionSendFile(){
    let currentDate = new Date();
    this.year = currentDate.getFullYear();
    this.month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
    this.day = currentDate.getDate();
    this.hour = currentDate.getHours();
    this.minutes  = currentDate.getMinutes();
    this.seconds = currentDate.getSeconds();
    if(this.month<10)
      this.month = '0'+ this.month;
    if(this.day<10) 
      this.day = '0'+ this.day;
    if(this.hour<10)   
      this.hour = '0'+ this.hour;
    if(this.minutes<10) 
      this.minutes = '0'+ this.minutes;
    if(this.seconds<10) 
      this.seconds = '0'+ this.seconds;
    let date = this.year+"/"+this.month+"/"+this.day;
    let typeTime =  this.hour >= 12 ? 'PM' : 'AM';
    let time = this.hour+":"+this.minutes+" "+typeTime;
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.chooser.getFile().then(async (file) =>{
      this.filedata = file;
    })
  }  
  async requestMediaPermission(): Promise<boolean> {
    if (!this.platform.is('android')) return true;
    const androidVersion = parseInt((navigator.userAgent.match(/Android (\d+)/) || [])[1], 10);
    if (androidVersion >= 13) {
      const perm = this.androidPermissions.PERMISSION.READ_MEDIA_IMAGES;
      const result = await this.androidPermissions.checkPermission(perm);
      if (!result.hasPermission) {
        const req = await this.androidPermissions.requestPermission(perm);
        return req.hasPermission;
      }
      return true;
    } else {
      // الأجهزة القديمة (أندرويد 9 وما أقل)
      const perms = [
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      ];
      const result = await this.androidPermissions.checkPermission(perms[0]);
      if (!result.hasPermission) {
        const req = await this.androidPermissions.requestPermissions(perms);
        return req.hasPermission;
      }
      return true;
    }
  }
  async functionSendImage(){
    const hasPermission = await this.requestMediaPermission();
    if (!hasPermission) {
      alert("No permission to upload images");
      return;
    }
    let optionsD: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.platform.is('ios') ? this.camera.PictureSourceType.SAVEDPHOTOALBUM : this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.platform.is('android') ? this.camera.EncodingType.JPEG : undefined
    };
    const fileTransfer: FileTransferObject = this.transfer.create();
    const formData = new FormData();
    let currentDate = new Date();
    this.year = currentDate.getFullYear();
    this.month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
    this.day = currentDate.getDate();
    this.hour = currentDate.getHours();
    this.minutes  = currentDate.getMinutes();
    this.seconds = currentDate.getSeconds();
    if(this.month<10)
      this.month = '0'+ this.month;
    if(this.day<10) 
      this.day = '0'+ this.day;
    if(this.hour<10)   
      this.hour = '0'+ this.hour;
    if(this.minutes<10) 
      this.minutes = '0'+ this.minutes;
    if(this.seconds<10) 
      this.seconds = '0'+ this.seconds;
    let date = this.year+"/"+this.month+"/"+this.day;
    let typeTime =  this.hour >= 12 ? 'PM' : 'AM';
    let time = this.hour+":"+this.minutes+" "+typeTime;
    this.camera.getPicture(optionsD).then(async(imageData) => {
      this.filedata = imageData;
    }, (err) => {
    });
  } 
  async functionSendVideo(){
    const hasPermission = await this.requestMediaPermission();
    if (!hasPermission) {
      alert("No permission to upload images");
      return;
    }
    let optionsD: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.platform.is('ios') ? this.camera.PictureSourceType.SAVEDPHOTOALBUM : this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.VIDEO,
    };
    let currentDate = new Date();
    this.year = currentDate.getFullYear();
    this.month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
    this.day = currentDate.getDate();
    this.hour = currentDate.getHours();
    this.minutes  = currentDate.getMinutes();
    this.seconds = currentDate.getSeconds();
    if(this.month<10)
      this.month = '0'+ this.month;
    if(this.day<10) 
      this.day = '0'+ this.day;
    if(this.hour<10)   
      this.hour = '0'+ this.hour;
    if(this.minutes<10) 
      this.minutes = '0'+ this.minutes;
    if(this.seconds<10) 
      this.seconds = '0'+ this.seconds;
    let date = this.year+"/"+this.month+"/"+this.day;
    let typeTime =  this.hour >= 12 ? 'PM' : 'AM';
    let time = this.hour+":"+this.minutes+" "+typeTime;
    this.camera.getPicture(optionsD).then(async(imageData) => {
      this.filedata = imageData;
    }, (err) => {
    });
  } 
  selectTempName(event:any){
    this.showTextArray = 0;
    this.showAddFileArray = 0;
    this.showInputArray = 0;
    this.showTextButtons = 0;
    this.showButtonsArrayVal = [];
    this.showInputArrayVal = [];
    let data = event.target.value;
    this.selectedTempInformation = this.returnTempForUsers[data];
    this.nameOfTem = this.returnTempForName[data]['name'];
    this.languageOfTem = this.returnTempForName[data]['language'];
    for(let i = 0; i < this.selectedTempInformation.length;i++){
      if(this.selectedTempInformation[i]['typeUse'] == 0 && this.selectedTempInformation[i]['type'] == "BODY"){
        this.showTextArrayVal = this.selectedTempInformation[i]['text'];
      }
      if(this.selectedTempInformation[i]['typeUse'] == 0 && this.selectedTempInformation[i]['type'] == "HEADER"){
        this.showTextArrayHeaderVal = this.selectedTempInformation[i]['text'];
      }
      if(this.selectedTempInformation[i]['typeUse'] == 0 && this.selectedTempInformation[i]['type'] == "FOOTER"){
        this.showTextArrayFooterVal= this.selectedTempInformation[i]['text'];
      }
      if(this.selectedTempInformation[i]['typeUse'] == 2){
        this.format = this.selectedTempInformation[i]['format']
        this.showAddFileArray = 1;
      }
      if(this.selectedTempInformation[i]['typeUse'] == 1){
        this.showInputArray = 1;
        this.showTextArrayVal = this.selectedTempInformation[i]['text'];
        this.showInputArrayVal = this.selectedTempInformation[i]['val'];
      }
      if(this.selectedTempInformation[i]['typeUse'] == 3){
        this.showTextButtons = 1;
        this.showButtonsArrayVal=this.selectedTempInformation[i]['buttons'];
      }
    }
  }
  selectTempNameSelected(event:any){
    this.showTextArray = 0;
    this.showAddFileArray = 0;
    this.showInputArray = 0;
    this.showTextButtons = 0;
    this.showButtonsArrayVal = [];
    this.showInputArrayVal = [];
    let data = event;
    this.selectedTempInformation = this.returnTempForUsers[data];
    this.nameOfTem = this.returnTempForName[data]['name'];
    this.languageOfTem = this.returnTempForName[data]['language'];
    for(let i = 0; i < this.selectedTempInformation.length;i++){
      if(this.selectedTempInformation[i]['typeUse'] == 0 && this.selectedTempInformation[i]['type'] == "BODY"){
        this.showTextArrayVal = this.selectedTempInformation[i]['text'];
      }
      if(this.selectedTempInformation[i]['typeUse'] == 0 && this.selectedTempInformation[i]['type'] == "HEADER"){
        this.showTextArrayHeaderVal = this.selectedTempInformation[i]['text'];
      }
      if(this.selectedTempInformation[i]['typeUse'] == 0 && this.selectedTempInformation[i]['type'] == "FOOTER"){
        this.showTextArrayFooterVal= this.selectedTempInformation[i]['text'];
      }
      if(this.selectedTempInformation[i]['typeUse'] == 2){
        this.format = this.selectedTempInformation[i]['format']
        this.showAddFileArray = 1;
      }
      if(this.selectedTempInformation[i]['typeUse'] == 1){
        this.showInputArray = 1;
        this.showTextArrayVal = this.selectedTempInformation[i]['text'];
        this.showInputArrayVal = this.selectedTempInformation[i]['val'];
      }
      if(this.selectedTempInformation[i]['typeUse'] == 3){
        this.showTextButtons = 1;
        this.showButtonsArrayVal=this.selectedTempInformation[i]['buttons'];
      }
    }
  }
  uplodeFile(type:any){
    if(type == 'IMAGE'){
      this.functionSendImage();
      this.linkType = 1;
    }
    if(type == 'DOCUMENT'){
      this.functionSendFile();
      this.linkType = 3;
    }
    if(type == 'VIDEO'){
      this.functionSendVideo();  
      this.linkType = 2;
    }
  }
  addMsgTemp(){
    this.allDataOfMessages = "";
    let val = 0;
    if(!this.showTextArrayHeaderVal){
    }else{
      val = 1;
      this.allDataOfMessages = this.showTextArrayHeaderVal
    }
    if(this.showInputArrayValAdd.length){
      this.showTextArrayValGen = this.showTextArrayVal;
      for(let i = 0; i < this.showInputArrayValAdd.length;i++){
        this.showTextArrayValGen = this.showTextArrayValGen.replace(this.showInputArrayValAdd[i]['replaval'], this.showInputArrayValAdd[i]['val']);
      }
      this.allDataOfMessagesMsg = this.showTextArrayValGen;
    }else{
      this.allDataOfMessagesMsg = this.showTextArrayVal;
    }
    if(val == 1){
      this.allDataOfMessages+="\r\n"+this.allDataOfMessagesMsg;
      val = 1;
    }else{
      this.allDataOfMessages+=this.allDataOfMessagesMsg;
      val = 1;
    }
    if(!this.showTextArrayFooterVal){
    }else{
      if(val == 1)
        this.allDataOfMessages+="\r\n"+this.showTextArrayFooterVal;
      else
      this.allDataOfMessages+= this.showTextArrayFooterVal;
      val = 1;
    }
    let currentDate = new Date();
    this.year = currentDate.getFullYear();
    this.month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
    this.day = currentDate.getDate();
    this.hour = currentDate.getHours();
    this.minutes  = currentDate.getMinutes();
    this.seconds = currentDate.getSeconds();
    if(this.month<10)
      this.month = '0'+ this.month;
    if(this.day<10) 
      this.day = '0'+ this.day;
    if(this.hour<10)   
      this.hour = '0'+ this.hour;
    if(this.minutes<10) 
      this.minutes = '0'+ this.minutes;
    if(this.seconds<10) 
      this.seconds = '0'+ this.seconds;
    this.genaratedFullDate = this.year+""+this.month+""+this.day;
    let key = this.mainUserName+this.userName+this.password+"(OLH)"+this.genaratedDate;
    const md5Hash = CryptoJS.algo.MD5.create();
    md5Hash.update(key);
    this.apiKey = md5Hash.finalize();
    this.apiKey=this.apiKey.toString();
    const fileTransfer: FileTransferObject = this.transfer.create();
    let valOfArray  = JSON.stringify(this.arraySendToServer);
    const sendValues = {'mainUserName':this.mainUserName,'templateName':this.nameOfTem,'lang':this.languageOfTem,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':this.number,'sessionLogin':this.sessionLogin,'msgWa':this.allDataOfMessages,valOfArray};
    if(this.filedata!=undefined && this.filedata!=null && this.filedata!=""){
      let fileName = "";
      let mimeType: string="";
      let sendValuesNew = {'mainUserName':this.mainUserName,'templateName':this.nameOfTem,'lang':this.languageOfTem,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':this.number,'sessionLogin':this.sessionLogin,'msgWa':this.allDataOfMessages,valOfArray,'linkType':this.linkType};
      if(this.linkType == 1){
        if (this.platform.is('android') && this.filedata.startsWith('content://')) {
          resolveLocalFileSystemURL(this.filedata, (fileEntry:any) => {
            fileEntry.file((file:any) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                if(reader.result) {
                  let extension = '';
                    if (file.type === 'image/jpeg') extension = '.jpg';
                    else if (file.type === 'image/png') extension = '.png';
                    else if (file.type === 'image/gif') extension = '.gif';
                    else extension = '.bin'; // fallback
                    let finalName = file.name;
                    if (!finalName || !finalName.includes('.')) {
                      finalName = 'image' + extension;
                    }
                  this.uploadImageFromContentUri(reader.result as ArrayBuffer, finalName, file.type,sendValuesNew);
                } else {
                  alert("error file");
                }
              };
              reader.onerror = (error) => {
                alert("error file");
              };
              reader.readAsArrayBuffer(file);
            }, (fileError:any) => {
              alert("error file");
            });
          }, (urlError:any) => {
            alert("error file");
          });
        } else {
          this.uploadImage(this.filedata,sendValuesNew);
        }
      }
      if(this.linkType == 2){
        if (this.platform.is('android') && this.filedata.startsWith('content://')) {
          resolveLocalFileSystemURL(this.filedata, (fileEntry:any) => {
            fileEntry.file((file:any) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                if(reader.result) {
                  let extension = '';
                    extension = '.mp4';
                    let finalName = file.name;
                    if (!finalName || !finalName.includes('.')) {
                      finalName = 'video' + extension;
                    }
                  this.uploadImageFromContentUri(reader.result as ArrayBuffer, finalName, file.type,sendValuesNew);
                } else {
                  alert("error file");
                }
              };
              reader.onerror = (error) => {
                alert("error file");
              };
              reader.readAsArrayBuffer(file);
            }, (fileError:any) => {
              alert("error file");
            });
          }, (urlError:any) => {
            alert("error file");
          });
        } else {
          this.uploadImage(this.filedata,sendValuesNew);
        }
      }
      if(this.linkType == 3){
        fileName = this.filedata.name;
        mimeType = this.filedata.mediaType;
        let options: FileUploadOptions = {
          fileKey: 'imgLink',
          fileName:fileName,
          mimeType:mimeType,
          chunkedMode:false,
          params: sendValuesNew,
          headers: {}
        }
        fileTransfer.upload(this.filedata.uri, "https://api.taqnyat.sa/chatSendTemplate.php", options)
        .then(async(data) => {
          alert("done")
          this.modalController.dismiss({
            "key":1
          })
        }, (err) => {
          alert("Notdone")
          this.modalController.dismiss({
            "key":1
          })
        })
      }
    }else{
      this.chatService.sendMessageTem(sendValues).then(async dataHist=>{
        this.returnResultDataBySession = dataHist;
        let errorDataSession = this.returnResultDataBySession.messageId;
        this.modalController.dismiss({
          "key":0
        })
      })
    }
  }
  getMimeType(extension: string): string {
    switch (extension.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
       case 'mp4':
        return 'video/mp4'; 
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      default:
        return ''; // يمكنك إضافة المزيد من الأنواع حسب الحاجة
    }
  }
  async uploadImage(imagePath: any,sendValuesData:any) {
    let imageName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
    let imageExtension = imageName.split('.').pop().toLowerCase();
    let imagemimeType: string = this.getMimeType(imageExtension);
    const formData = new FormData();
    const response = await fetch(imagePath);
    const blob = await response.blob();
    formData.append('imgLink', blob, imageName);
    for (const key in sendValuesData) {
      formData.append(key, (sendValuesData as any)[key]);
    }
    try {
      const uploadResponse = await fetch("https://api.taqnyat.sa/chatSendTemplate.php", {
        method: 'POST',
        body: formData
      });
      const data = await uploadResponse.text();
    } catch (error) {
    }
    this.modalController.dismiss({
      "key":1
    })
  }
  async uploadImageFromContentUri(fileData: ArrayBuffer, fileName: string, mimeType: string,sendValuesData:any) {
    alert(JSON.stringify(sendValuesData));
    const formData = new FormData();
    const blob = new Blob([fileData], { type: mimeType });
    formData.append('imgLink', blob, fileName);
    for (const key in sendValuesData) {
      formData.append(key, (sendValuesData as any)[key]);
    }
    try {
      const uploadResponse = await fetch("https://api.taqnyat.sa/chatSendTemplate.php", {
        method: 'POST',
        body: formData
      });
      alert("ddddone");
      const data = await uploadResponse.text();
    } catch (error) {
      alert("notddddone");
    }
    this.modalController.dismiss({
      "key":1
    })
  }
  close(){
    this.modalController.dismiss({
      "key":0
    })
  }
}
