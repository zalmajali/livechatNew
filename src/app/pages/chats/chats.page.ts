import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import {LoadingController, MenuController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from '@ionic/storage-angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import {ChatService} from "../../service/chat.service";
import {DatabaseService} from "../../service/database.service";
import * as CryptoJS from 'crypto-js';
import { ActivatedRoute,Router } from '@angular/router';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { PopoverController } from '@ionic/angular';
import { PopovercontentComponent } from '../popovercontent/popovercontent.component';
import { FastresponseComponent } from '../fastresponse/fastresponse.component';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import {SubmenuComponent} from "../submenu/submenu.component";
import {TemplateComponent} from "../template/template.component";
import 'emoji-picker-element';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';
declare var resolveLocalFileSystemURL: any;
interface ConvertedAudio {
  link: string;
}
@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone:false
})
export class ChatsPage implements OnInit {
@ViewChild('chatList', { read: ElementRef }) private chatList: ElementRef  | any;
public arrow_back:any;
public arrow_go:any;
public floatD:any;
public returnResultData:any;
public returnChatArray:any = [];
public returnArrayChatFromServer:any;
public returnResultDataByNumber:any;
public returnArrayChatDataByNumberFromServer:any;
public chatVal:any = 2;
public send_image:any;
public selectNumber:any;
public chatSessionId:any;
public returnResultDataBySession:any;
public returnResultConvert:any;
public returnArrayChatSessionFromServer:any;
public counter:any;
public returnDataFromPop:any;
public view_contact:any;
public close_chat:any;
public assign_to:any;
public archives:any;
public mute_chat:any;
public span_menue:any;
//message
public toggled = false;
public allMasseges:any=[];
public onMessage:any="";
public chat_class_one:any;
public chat_class_tow:any;
public chat_class_three:any;
public chat_class_fore:any;
public chat_class_five:any;
public chat_class_six:any;
public chat_class_seven:any;
public message_text:any;
public filedata:any;
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
public dbInstance!: SQLiteObject;
public checkDataConvert: any=0;
public allMassegesCheckData: Set<any> = new Set();
  constructor( private device: Device,private filePath: FilePath,private androidPermissions: AndroidPermissions,private sanitizer: DomSanitizer,private transfer: FileTransfer,private camera: Camera,private http: HttpClient,private chooser: Chooser,private popoverCtrl: PopoverController,private file: File,private activaterouter : ActivatedRoute,private databaseService: DatabaseService,private router: Router,private chatService: ChatService,private globalization: Globalization, private translate: TranslateService,private modalController: ModalController,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
    this.menu.enable(false,"sideMenu");
    setTimeout(() => {
      const chatListElement = this.chatList.nativeElement as HTMLElement;
      const shouldScroll = chatListElement.scrollHeight > chatListElement.clientHeight;
      if (shouldScroll) {
        chatListElement.scrollTop = chatListElement.scrollHeight;
      }
    }, 100);
  }
  initialiseTranslation(){
    this.translate.get('menuDirection').subscribe((res: string) => {
      this.menuDirection = res;
    });
    this.translate.get('menuDirectionTow').subscribe((res: string) => {
      this.menuDirectionTow = res;
    });
    this.translate.get('floatD').subscribe((res: string) => {
      this.floatD = res;
    });
    this.translate.get('arrow_back').subscribe((res: string) => {
      this.arrow_back = res;
    });
    this.translate.get('arrow_go').subscribe((res: string) => {
      this.arrow_go = res;
    });
    this.translate.get('chat_class_one').subscribe((res: string) => {
      this.chat_class_one = res;
    });
    this.translate.get('chat_class_tow').subscribe((res: string) => {
      this.chat_class_tow = res;
    });
    this.translate.get('chat_class_three').subscribe((res: string) => {
      this.chat_class_three = res;
    });
    this.translate.get('chat_class_fore').subscribe((res: string) => {
      this.chat_class_fore = res;
    });
    this.translate.get('chat_class_five').subscribe((res: string) => {
      this.chat_class_five = res;
    });
    this.translate.get('chat_class_six').subscribe((res: string) => {
      this.chat_class_six = res;
    });
    this.translate.get('chat_class_seven').subscribe((res: string) => {
      this.chat_class_seven = res;
    });
    this.translate.get('send_image').subscribe((res: string) => {
      this.send_image = res;
    });
    this.translate.get('message_text').subscribe((res: string) => {
      this.message_text = res;
    });

    this.translate.get('view_contact').subscribe((res: string) => {
      this.view_contact = res;
    });
    this.translate.get('close_chat').subscribe((res: string) => {
      this.close_chat = res;
    });
    this.translate.get('assign_to').subscribe((res: string) => {
      this.assign_to = res;
    });
    this.translate.get('archives').subscribe((res: string) => {
      this.archives = res;
    });
    this.translate.get('mute_chat').subscribe((res: string) => {
      this.mute_chat = res;
    });
    this.translate.get('span_menue').subscribe((res: string) => {
      this.span_menue = res;
    });
  }
  ngAfterViewInit() {
    const chatEl = this.chatList.nativeElement;
    chatEl.addEventListener('scroll', () => {
      const atBottom = Math.ceil(chatEl.scrollHeight) - Math.ceil(chatEl.scrollTop) === Math.ceil(chatEl.clientHeight);
      this.isScroolTo = atBottom ? 1 : 0;
    });
  }
  async ngOnInit() {
    await this.getDeviceLanguage();
    await this.checkLoginUser();
    this.mainUserName = await this.storage.get('mainUserName');
    this.userName = await this.storage.get('userName');
    this.password = await this.storage.get('password');
    this.apiKey = await this.storage.get('apiKey');
    this.sessionLogin = await this.storage.get('sessionLogin');
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
    this.genaratedDate = this.year+""+this.month+""+this.day;
    this.genaratedFullDate = this.year+""+this.month+""+this.day+this.hour+this.minutes+this.seconds; 
    await this.activaterouter.params.subscribe(async (params:any) => {
      if(params['number']!="" && params['number']!=null && params['number']!=undefined && params['number']!=0){
        this.selectNumber = params['number'];
        await this.storage.set('selectedNumber',this.selectNumber);
      }
      if(params['chatSessionId']!="" && params['chatSessionId']!=null && params['chatSessionId']!=undefined && params['chatSessionId']!=0){
        this.chatSessionId = params['chatSessionId'];
        await this.storage.set('selectedChatSessionId',this.chatSessionId);
      }
      await this.functionFeachData(this.selectNumber,this.chatSessionId);
      await this.functionChatSeen(this.selectNumber);
    });
    // Load initial messages if any
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
      if(this.filedata!=undefined && this.filedata!=null && this.filedata!=""){
        let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':this.selectNumber,'sessionLogin':this.sessionLogin};
        let options: FileUploadOptions = {
          fileKey: 'chatFile',
          fileName:this.filedata.name,
          mimeType:this.filedata.mediaType,
          chunkedMode:false,
          params: sendValues,
          headers: {}
        }
          fileTransfer.upload(this.filedata.uri, "https://api.taqnyat.sa/chatSendFile.php", options)
          .then(async(data) => {
           // await this.functionFeachData(this.selectNumber,this.chatSessionId);
            //await this.functionChatSeen(this.selectNumber);
            this.onMessage = "";
          }, (err) => {
            
        })
      }
  })
  .catch((error: any) => {});
  this.toggled = false;
  }
  functionChatSeen(selectNumber:any){
    let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':this.selectNumber};
    this.chatService.chatSeen(sendValues).then(async dataHist=>{
      this.returnResultDataBySession = dataHist;
      let errorDataSession = this.returnResultDataBySession.messageId;
      if(errorDataSession == 1){
        //await this.functionFeachData(this.selectNumber,this.chatSessionId);
      }
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
  async functionSendImage() {
    if(this.platform.is('android')){
      const hasPermission = await this.requestMediaPermission();
      if (!hasPermission) {
        alert("No permission to upload images");
        return;
      }
    }
    let optionsD: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.platform.is('ios') ? this.camera.PictureSourceType.SAVEDPHOTOALBUM : this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.platform.is('android') ? this.camera.EncodingType.JPEG : undefined
    };
    this.camera.getPicture(optionsD).then(async (imageData) => {
      if (this.platform.is('android') && imageData.startsWith('content://')) {
        resolveLocalFileSystemURL(imageData, (fileEntry:any) => {
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
                  let imageName = imageData.substring(imageData.lastIndexOf('/') + 1);
                  if (!finalName || !finalName.includes('.')) {
                    finalName = imageName + extension;
                  }
                this.uploadImageFromContentUri(reader.result as ArrayBuffer, finalName, file.type);
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
        this.uploadImage(imageData);
      }
    }, (err) => {
      alert("error file");
    });
    this.toggled = false;
  }
  async uploadImage(imagePath: any) {
    let imageName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
    let imageExtension = imageName.split('.').pop().toLowerCase();
    alert(imageName);
    alert(imageExtension);
    let imagemimeType: string = this.getMimeType(imageExtension);
    const formData = new FormData();
    const response = await fetch(imagePath);
    const blob = await response.blob();
    formData.append('chatFile', blob, imageName);
    const sendValues = {
      'mainUserName': this.mainUserName,
      'userName': this.userName,
      'password': this.password,
      'apiKey': this.apiKey,
      'mobile': this.selectNumber,
      'sessionLogin': this.sessionLogin
    };
    for (const key in sendValues) {
      formData.append(key, (sendValues as any)[key]);
    }
    try {
    alert("sdfsdffsdf")

      const uploadResponse = await fetch("https://dev.taqnyat.sa/liveChatTest/chatSendFileJ.php", {
        method: 'POST',
        body: formData
      });
      const data = await uploadResponse.text();
      await this.functionChatSeen(this.selectNumber);
      alert("done")
      this.onMessage = "";
    } catch (error) {
      alert("error file");
    }
  }
  async uploadImageFromContentUri(fileData: ArrayBuffer, fileName: string, mimeType: string) {
    const formData = new FormData();
    const blob = new Blob([fileData], { type: mimeType });
    formData.append('chatFile', blob, fileName);
    const sendValues = {
      'mainUserName': this.mainUserName,
      'userName': this.userName,
      'password': this.password,
      'apiKey': this.apiKey,
      'mobile': this.selectNumber,
      'sessionLogin': this.sessionLogin
    };
    for (const key in sendValues) {
      formData.append(key, (sendValues as any)[key]);
    }
    try {
      const uploadResponse = await fetch("https://api.taqnyat.sa/chatSendFile.php", {
        method: 'POST',
        body: formData
      });
      const data = await uploadResponse.text();
      await this.functionChatSeen(this.selectNumber);
      this.onMessage = "";
    } catch (error) {
    }
  }
  getMimeType(extension: string): string {
    switch (extension.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      default:
        return ''; // يمكنك إضافة المزيد من الأنواع حسب الحاجة
    }
  }
  formatDateTime(date: Date): string {
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hours: any = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12).toString().padStart(2, '0'); // Convert to 12-hour format
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds} ${ampm}`;
  }
  functionSelectEmoji(event:any){
    this.onMessage += ' ' + event.emoji.unicode;
  }
  async extractAudioSrc(html: any) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const sourceElement = doc.querySelector('audio source');
    if (sourceElement) {
      const data = sourceElement.getAttribute('src');
      if (data && data.endsWith('.ogg')) {
        try {
          let updatedHtml = "";
          const dataHist = await this.chatService.convertData({'link': data, 'user': this.userName});
          this.returnResultConvert = dataHist;
          sourceElement.setAttribute('src', this.returnResultConvert.link);
          updatedHtml = doc.body.innerHTML;
          updatedHtml = updatedHtml.replace(/&nbsp;/g, '').replace(/<br>/g, '');
          return updatedHtml;
        } catch (error) {
          return "error";
        }
      }
      return "error";
    }
    return null;
  }
  async functionFeachData(numberUser:any,chatSessionId:any){
    let key = this.mainUserName+this.userName+this.password+"(OLH)"+this.genaratedDate;
    const md5Hash = CryptoJS.algo.MD5.create();
    md5Hash.update(key);
    this.apiKey = md5Hash.finalize();
    this.apiKey=this.apiKey.toString();
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
    this.genaratedFullDate = this.year+""+this.month+""+this.day+this.hour+this.minutes+this.seconds;
    let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':numberUser,'sessionLogin':this.sessionLogin,'chatSessionId':chatSessionId};
    await this.chatService.chatGetDataByNumber(sendValues).then(async dataHist=>{
      this.returnResultDataBySession = dataHist;
      let errorDataSession = this.returnResultDataBySession.messageId;
      if(errorDataSession == 1){
        this.allMasseges = [];
        this.returnArrayChatSessionFromServer = this.returnResultDataBySession.data.process;
        this.counter = 0;
        if(typeof this.returnArrayChatSessionFromServer[0].chatBot!== 'undefined'){
          let chatBot = this.returnArrayChatSessionFromServer[0].chatBot;
          for(let j = 0; j < chatBot.length;j++) {
            let msgIdid = chatBot[j].id;
            this.allMassegesCheckData.add(msgIdid);
            let numberSR = numberUser;
            let msg = chatBot[j].txt;
            let string = "<i class='material-icons medium'       style=cursor:default;color:#000000;>insert_drive_file </i>";
            if (chatBot[j].txt.includes(string)) {
              msg = chatBot[j].txt.replace(string, "<img src=\"../../assets/images/file.png\">");
            } 
            let Txt = "Txt[(RT)]";
            let Txt2 = "Btn";
            let Txt3 = "BS";
            let Txt4 = "<audio";
            let checkAudio = 0;
            let doneReadAudio = 1;
            if (chatBot[j].txt.includes(Txt2) || chatBot[j].txt.includes(Txt3)) {
              msg = await this.parseResponse(chatBot[j].txt);
            }
            else if(chatBot[j].txt.includes(Txt)) {
              msg = chatBot[j].txt.replace(Txt, "");  
            }else if(chatBot[j].txt.includes(Txt4)) {
              checkAudio = 1;
              doneReadAudio = 0;
              msg =  msg+ '<div class="loading">Loading...</div>';
            }
            msg = msg.replace(/\r\n/g, "<br>");
            if(!checkAudio)
              msg = this.sanitizer.bypassSecurityTrustHtml(msg);
            let time = chatBot[j].time;
            let date = chatBot[j].date;
            let dateId = chatBot[j].dateId;
            let from = chatBot[j].support;
            let filePath = 0;
            let msg_status = 0;
            let session_id = chatSessionId;
            let private_note = 0;
            ++this.counter;
            await this.allMasseges.push({
                    msgId: msgIdid,
                    checkAudio: checkAudio,
                    doneReadAudio: doneReadAudio,
                    number: numberSR,
                    msg: msg,
                    time: time,
                    date: date,
                    dateId: dateId,
                    from: from,
                    filePath: filePath,
                    msg_status: msg_status,
                    session_id: session_id,
                    private_note: private_note
            });
          }
        }
        if(typeof this.returnArrayChatSessionFromServer[0].chat!== 'undefined'){
          let chat = this.returnArrayChatSessionFromServer[0].chat;
          for(let jj = 0; jj < chat.length;jj++) {
            let msgIdid = chat[jj].id;
            this.allMassegesCheckData.add(msgIdid);
            let numberSR = numberUser;
            let msg = chat[jj].txt;
            let string = "<i class='material-icons medium'       style=cursor:default;color:#000000;>insert_drive_file </i>";
            if (chat[jj].txt.includes(string)) {
              msg = chat[jj].txt.replace(string, "<img src=\"../../assets/images/file.png\">");
            }
            let Txt = "Txt[(RT)]";
            let Txt2 = "Btn";
            let Txt3 = "BS";
            let Txt4 = "<audio";
            let checkAudio = 0;
            let doneReadAudio = 1;
            if (chat[jj].txt.includes(Txt2) || chat[jj].txt.includes(Txt3)) {
              msg = await this.parseResponse(chat[jj].txt);
            } 
            else if(chat[jj].txt.includes(Txt)) {
              msg = chat[jj].txt;
            }else if(chat[jj].txt.includes(Txt4)) {
              checkAudio = 1;
              doneReadAudio = 0;
              msg =  msg+ '<div class="loading">Loading...</div>';
            }
            msg = msg.replace(/\r\n/g, "<br>");
            if(!checkAudio)
              msg = this.sanitizer.bypassSecurityTrustHtml(msg);
            let time = chat[jj].time;
            let date = chat[jj].date;
            let dateId = chat[jj].dateId;
            let from = chat[jj].support;
            let filePath = chat[jj].filePath;
            let msg_status = chat[jj].msgStatus;
            let session_id = chatSessionId;
            let private_note = chat[jj].privateNote;
            await this.allMasseges.push({
              msgId: msgIdid,
              checkAudio: checkAudio,
              doneReadAudio: doneReadAudio,
              number: numberSR,
              msg: msg,
              time: time,
              date: date,
              dateId: dateId,
              from: from,
              filePath: filePath,
              msg_status: msg_status,
              session_id: session_id,
              private_note: private_note
           });
          }
        }
      }
      setTimeout(() => {
        const chatListElement = this.chatList.nativeElement as HTMLElement;
        chatListElement.scrollTop = chatListElement.scrollHeight;
        this.isScroolTo=1;
        this.countOfNewMsg = 0;
      }, 50); 
    })
    await this.convertAudioFilesInBackground();
    await this.functionFeachDataEverySe(numberUser,chatSessionId);
    await this.functionFeachDataEveryStatuse(numberUser,chatSessionId);
  }
  async convertAudioFilesInBackground() {
    for (let i = 0; i < this.allMasseges.length; i++) {
      if (this.allMasseges[i].checkAudio && !this.allMasseges[i].doneReadAudio) {
        let updatedHtml = await this.extractAudioSrc(this.allMasseges[i].msg);
        if (updatedHtml) {
          this.allMasseges[i].msg = updatedHtml;
          this.allMasseges[i].doneReadAudio = 1;
          this.allMasseges[i].msg = await this.allMasseges[i].msg.replace('<div class="loading">Loading...</div>', "");
          this.allMasseges[i].msg = await this.sanitizer.bypassSecurityTrustHtml(this.allMasseges[i].msg);
        }else
          continue;
      }
    }
  }
  async functionFeachDataEverySe(numberUser:any,chatSessionId:any){
    let key = this.mainUserName+this.userName+this.password+"(OLH)"+this.genaratedDate;
    const md5Hash = CryptoJS.algo.MD5.create();
    md5Hash.update(key);
    this.apiKey = md5Hash.finalize();
    this.apiKey=this.apiKey.toString();
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
    this.genaratedFullDate = this.year+""+this.month+""+this.day+this.hour+this.minutes+this.seconds;
    let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':numberUser,'sessionLogin':this.sessionLogin,'chatSessionId':chatSessionId};
    this.checkDataConvert=0;
    await this.chatService.chatGetDataByNumber(sendValues).then(async dataHist=>{
      this.returnResultDataBySession = dataHist;
      let errorDataSession = this.returnResultDataBySession.messageId;
      if(errorDataSession == 1){
        this.returnArrayChatSessionFromServer = this.returnResultDataBySession.data.process;
        this.counter = 0;
        if(typeof this.returnArrayChatSessionFromServer[0].chatBot!== 'undefined'){
          let chatBot = this.returnArrayChatSessionFromServer[0].chatBot;
          for(let j = 0; j < chatBot.length;j++) {
            let msgIdid = chatBot[j].id;
            if (!this.allMassegesCheckData.has(msgIdid)) {
              this.allMassegesCheckData.add(msgIdid);
              ++this.checkDataConvert;
              let numberSR = numberUser;
              let msg = chatBot[j].txt;
              let string = "<i class='material-icons medium'       style=cursor:default;color:#000000;>insert_drive_file </i>";
              if (chatBot[j].txt.includes(string)) {
                msg = chatBot[j].txt.replace(string, "<img src=\"../../assets/images/file.png\">");
              } 
              let Txt = "Txt[(RT)]";
              let Txt2 = "Btn";
              let Txt3 = "BS";
              let Txt4 = "<audio";
              let checkAudio = 0;
              let doneReadAudio = 1;
              if (chatBot[j].txt.includes(Txt2) || chatBot[j].txt.includes(Txt3)) {
                msg = await this.parseResponse(chatBot[j].txt);
              } 
              else if(chatBot[j].txt.includes(Txt)) {
                msg = chatBot[j].txt;
              }else if(chatBot[j].txt.includes(Txt4)) {
                checkAudio = 1;
                doneReadAudio = 0;
                msg =  msg+ '<div class="loading">Loading...</div>';
              } 
              msg = msg.replace(/\r\n/g, "<br>");
              if(!checkAudio)
                msg = this.sanitizer.bypassSecurityTrustHtml(msg);
              let time = chatBot[j].time;
              let date = chatBot[j].date;
              let dateId = chatBot[j].dateId;
              let from = chatBot[j].support;
              let filePath = 0;
              let msg_status = 0;
              let session_id = chatSessionId;
              let private_note = 0;
              ++this.counter;
              await this.allMasseges.push({
                      msgId: msgIdid,
                      checkAudio: checkAudio,
                      doneReadAudio: doneReadAudio,
                      number: numberSR,
                      msg: msg,
                      time: time,
                      date: date,
                      dateId: dateId,
                      from: from,
                      filePath: filePath,
                      msg_status: msg_status,
                      session_id: session_id,
                      private_note: private_note
              });
              if(this.isScroolTo==1){
                setTimeout(() => {
                  const chatListElement = this.chatList.nativeElement as HTMLElement;
                  chatListElement.scrollTop = chatListElement.scrollHeight;
                  this.countOfNewMsg=0;
                  this.isScroolTo=1;
                }, 100); 
              }else{
                this.countOfNewMsg++;
              }
            }
          }
        }
        if(typeof this.returnArrayChatSessionFromServer[0].chat!== 'undefined'){
          let chat = this.returnArrayChatSessionFromServer[0].chat;
          for(let jj = 0; jj < chat.length;jj++) {
            let msgIdid = chat[jj].id;
            if (!this.allMassegesCheckData.has(msgIdid)) {
              this.allMassegesCheckData.add(msgIdid);
              ++this.checkDataConvert;
              let numberSR = numberUser;
              let msg = chat[jj].txt;
              let string = "<i class='material-icons medium'       style=cursor:default;color:#000000;>insert_drive_file </i>";
              if (chat[jj].txt.includes(string)) {
                msg = chat[jj].txt.replace(string, "<img src=\"../../assets/images/file.png\">");
              } 
              let Txt = "Txt[(RT)]";
              let Txt2 = "Btn";
              let Txt3 = "BS";
              let Txt4 = "<audio";
              let checkAudio = 0;
              let doneReadAudio = 1;
              if (chat[jj].txt.includes(Txt2) || chat[jj].txt.includes(Txt3)) {
                msg = await this.parseResponse(chat[jj].txt);
              } 
              else if(chat[jj].txt.includes(Txt)) {
                msg = chat[jj].txt;
              }else if(chat[jj].txt.includes(Txt4)) {
                checkAudio = 1;
                doneReadAudio = 0;
                msg =  msg+ '<div class="loading">Loading...</div>';
              } 
              msg = msg.replace(/\r\n/g, "<br>");
              if(!checkAudio)
                msg = this.sanitizer.bypassSecurityTrustHtml(msg);
              let time = chat[jj].time;
              let date = chat[jj].date;
              let dateId = chat[jj].dateId;
              let from = chat[jj].support;
              let filePath = chat[jj].filePath;
              let msg_status = chat[jj].msgStatus;
              let session_id = chatSessionId;
              let private_note = chat[jj].privateNote;
              await this.allMasseges.push({
                msgId: msgIdid,
                checkAudio: checkAudio,
                doneReadAudio: doneReadAudio,
                number: numberSR,
                msg: msg,
                time: time,
                date: date,
                dateId: dateId,
                from: from,
                filePath: filePath,
                msg_status: msg_status,
                session_id: session_id,
                private_note: private_note
            });
            if(this.isScroolTo==1){
              setTimeout(() => {
                const chatListElement = this.chatList.nativeElement as HTMLElement;
                chatListElement.scrollTop = chatListElement.scrollHeight;
                this.countOfNewMsg=0;
                this.isScroolTo=1;
              }, 100); 
            }else{
              this.countOfNewMsg++;
            }
            }
        }
        }
      }
    });
    if(this.checkDataConvert!=0){
      await this.convertAudioFilesInBackground();
    }
    await this.functionChatSeen(this.selectNumber);
    setTimeout(() => {
        this.functionFeachDataEverySe(numberUser,chatSessionId);
    }, 1000);
  }
  parseResponse(response: string): string {
    let html = '';
    // استخراج النص الترحيبي
    const welcomeMessageMatch = response.match(/\[\(extraBtn\)\](.*?)<br>/);
    if (welcomeMessageMatch) {
      html += `<p class="welcome-message">${welcomeMessageMatch[1]}</p>`;
    }
    // استخراج الأزرار
    const buttonRegex = /Btn\[\(RT\)\](.*?)\[\(BS\)\]/g;
    const buttonMatches = response.match(buttonRegex);
    if (buttonMatches) {
      buttonMatches.forEach((btn) => {
        const buttonText = btn.replace(/Btn\[\(RT\)\]|\[\(BS\)\]/g, '');
        html += ``;
      });
    }
    // استخراج النصوص العادية
    const textRegex = /Txt\[\(BS\)\](.*?)\[\(BS\)\]/g;
    const textMatches = response.match(textRegex);
    if (textMatches) {
      textMatches.forEach((txt) => {
        const textContent = txt.replace(/Txt\[\(BS\)\]|\[\(BS\)\]/g, '');
        html += `<ion-button class="buttonWight buttonWidth" mode="ios">${textContent}</ion-button><br>`;
      });
    }
    // استخراج النصوص بين (SB)
    const sbRegex = /\[\(SB\)\](.*?)\[\(SB\)\]/g;
    const sbMatches = response.match(sbRegex);
    if (sbMatches) {
      sbMatches.forEach((sb) => {
        const sbText = sb.replace(/\[\(SB\)\]/g, '');
        html += `<div class="sb">${sbText}</div>`;
      });
    }

    return html;
  }
  async functionFeachDataEveryStatuse(numberUser:any,chatSessionId:any){
    let key = this.mainUserName+this.userName+this.password+"(OLH)"+this.genaratedDate;
    const md5Hash = CryptoJS.algo.MD5.create();
    md5Hash.update(key);
    this.apiKey = md5Hash.finalize();
    this.apiKey=this.apiKey.toString();
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
    this.genaratedFullDate = this.year+""+this.month+""+this.day+this.hour+this.minutes+this.seconds;
    let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':numberUser,'sessionLogin':this.sessionLogin,'chatSessionId':chatSessionId};
    this.chatService.chatGetDataByNumber(sendValues).then(async dataHist=>{
      this.returnResultDataBySession = dataHist;
      let errorDataSession = this.returnResultDataBySession.messageId;
      if(errorDataSession == 1){
        this.returnArrayChatSessionFromServer = this.returnResultDataBySession.data.process;
        this.counter = 0;
        if(typeof this.returnArrayChatSessionFromServer[0].chatBot!== 'undefined'){
          let chatBot = this.returnArrayChatSessionFromServer[0].chatBot;
          for(let j = 0; j < chatBot.length;j++) {
            this.allMasseges.forEach((item: any) => {
              if (item.msgId === chatBot[j].id) {
                  item.msg_status = chatBot[j].msgStatus;
              }
          });
          }
        }
        if(typeof this.returnArrayChatSessionFromServer[0].chat!== 'undefined'){
          let chat = this.returnArrayChatSessionFromServer[0].chat;
          for(let jj = 0; jj < chat.length;jj++) {
            this.allMasseges.forEach((item: any) => {
              if (item.msgId === chat[jj].id) {
                  item.msg_status = chat[jj].msgStatus;
              }
          });
        }
        }
      }
    })
    setTimeout(() => {
      this.functionFeachDataEveryStatuse(numberUser,chatSessionId);
    }, 2000);
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
        if (Val[0] == "ar" ||  Val[0] == "en")
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
  functionBackHome(){
    this.navCtrl.navigateRoot('home');
  }
  async displayResult(message:any){
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 4500,
      position: 'bottom',
      cssClass:"toastStyle",
      color:""
    });
    await toast.present();
  }
  scrollToBottom() {
    setTimeout(() => {
        const chatListElement = this.chatList.nativeElement as HTMLElement;
        chatListElement.scrollTop = chatListElement.scrollHeight;
        this.countOfNewMsg=0;
        this.isScroolTo=1;
    }, 50);
  }
  async addMessage() { 
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
    if (this.onMessage.trim()) {
      let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':this.selectNumber,'sessionLogin':this.sessionLogin,'chatTxt':this.onMessage};
      this.chatService.sendMessage(sendValues).then(async dataHist=>{
        this.returnResultDataBySession = dataHist;
        let errorDataSession = this.returnResultDataBySession.messageId;
        if(errorDataSession == 1){
          //await this.functionFeachData(this.selectNumber,this.chatSessionId);
          //await this.functionChatSeen(this.selectNumber);
          this.onMessage = "";
        }
        setTimeout(() => {
          const chatListElement = this.chatList.nativeElement as HTMLElement;
          chatListElement.scrollTop = chatListElement.scrollHeight;
        }, 100); 
      })
    }
    setTimeout(() => {
      const chatListElement = this.chatList.nativeElement as HTMLElement;
      chatListElement.scrollTop = chatListElement.scrollHeight;
    }, 100);
    this.toggled = false;
  }
  functionGoToButtom(){
    setTimeout(() => {
      const chatListElement = this.chatList.nativeElement as HTMLElement;
      chatListElement.scrollTop = chatListElement.scrollHeight;
    }, 50); 
  }
  onScroll(event:any){
    const scrollElement = event.target as HTMLElement;
    if (scrollElement.scrollTop) {
     this.isScroolTo = 0;
    }
    const scrollHeight = Math.ceil(scrollElement.scrollHeight);
    const scrollTop = scrollElement.scrollTop;
    const offsetHeight = scrollElement.offsetHeight;
    const scrollendPage = Math.ceil(scrollTop + offsetHeight);
    if (scrollendPage >= scrollHeight) {
      this.isScroolTo = 1;
      this.countOfNewMsg=0;
    }
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopovercontentComponent,
      event: ev,
      animated:true,
      translucent: true,
      showBackdrop:false,
    });
    await popover.present();
    this.returnDataFromPop = await popover.onWillDismiss();
    if(this.returnDataFromPop!=undefined && this.returnDataFromPop!=0 && this.returnDataFromPop!=null){
      let data = this.returnDataFromPop.data;
      if(data == 1){
        this.functionSendFile();
      }else if(data == 2){
        this.functionSendImage();
      }else if(data == 3){
        this.functionSendFile();
      }else if(data == 4){
        this.functionMenueTemp();
      }else if(data == 5){
        this.fastresponse(ev);
      }
    }
  }
  async fastresponse(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: FastresponseComponent,
      event: ev,
      animated:true,
      translucent: true,
      showBackdrop:false,
    });
    await popover.present();
    this.returnDataFromPop = await popover.onWillDismiss();
    if(this.returnDataFromPop!=undefined && this.returnDataFromPop!=0 && this.returnDataFromPop!=null){
      let data = this.returnDataFromPop.data;
      this.onMessage = data;
    }
  }
  functionContact(){
    this.navCtrl.navigateRoot('contacts');
  }
  functionArchive(number:any,chatSessionId:any){
    this.navCtrl.navigateRoot(['/archive', {number:number,chatSessionId:chatSessionId,type:1}]);
  }
  async functionMenueformation(type:any){
    this.modalController.dismiss({});
    let model = await this.modalController.create({
      component:SubmenuComponent,
      animated:true,
      componentProps:{type:type,number:this.selectNumber},
      cssClass:"my-custom-modal"
    });
    model.onDidDismiss().then((data):any=>{
    });
    await model.present();
  }
  async functionMenueTemp(){
    this.modalController.dismiss({});
    let model = await this.modalController.create({
      component:TemplateComponent,
      animated:true,
      componentProps:{number:this.selectNumber},
      cssClass:"my-custom-modal-temp"
    });
    model.onDidDismiss().then((data):any=>{
      //this.functionFeachData(this.selectNumber,this.chatSessionId);
      //this.functionChatSeen(this.selectNumber);
    });
    await model.present();
  }
  functionCloseMenu(){
    this.modalController.dismiss({});
  }
  
}
