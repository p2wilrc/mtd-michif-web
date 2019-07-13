import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DictionaryData } from './models';
import { BookmarkService, MTDService } from '../services';
import { SearchComponent } from '../pages';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingsDialog, SettingsDialogData } from '../pages/shared/settings.component'

@Component({
  selector: 'mtd-root',
  templateUrl: 'app.component.html'
})
export class MTDApp {
  bookmarks: DictionaryData[];
  rootPage: any = SearchComponent;
  settings: SettingsDialogData = { name: 'bloop' };
  public appPages: Array<{ title: string, icon?: any, url: string }> = [
    { title: "Home", url: '/' },
    { title: "Search", url: '/search' },
    { title: "Browse", url: '/browse' },
    { title: "Pick a Random Word!", url: '/random' },
    { title: "Bookmarks", url: '/bookmarks' },
    { title: "Flashcards", url: '/flashcards' },
    { title: "About", url: '/about' }
  ];

  constructor(private router: Router, private bookmarkService: BookmarkService, public dialog: MatDialog, private mtdService: MTDService) {

    this.mtdService.config$.subscribe((config) => {

      let language_name = config.L1.name
      let build_no = config.build
      let id = language_name + build_no

      this.mtdService.dataDict$.subscribe((dataDict) => {
        // retrieve favourited entries from storage and tag favourited entries
        let val = localStorage.getItem(id)
        if (val) {
          console.log(val)
          val = JSON.parse(val);
          let favs = [];
          for (let fav of val) {
            for (let entry of dataDict) {
              if (entry.entryID === fav) {
                entry['favourited'] = true;
                favs.push(entry)
                break;
              }
            }
          }
          this.bookmarkService.setBookmarks(favs);
        }
        console.log(this.bookmarkService.bookmarks.value);
      })


    })

    // });
  }


  openSettings(): void {
    const dialogRef = this.dialog.open(SettingsDialog, {
      width: '250px',
      data: { name: 'test' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.settings['name'] = result;
    });
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // this.nav.setRoot(page.component);
    this.router.navigate(page.component);
  }

  // isiPad() {
  // return this.platform.is('iPad')

  // }
}

