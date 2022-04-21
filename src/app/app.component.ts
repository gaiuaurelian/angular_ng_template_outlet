import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  VERSION,
  ViewChild,
} from '@angular/core';

/**
 * Interface for ngTemplateOutlet without context
 */
interface TemplateType {
  key: string;
  associatedTemplate?: TemplateRef<any>;
}

/** Interface used for ngTemplateOutlet with context for passing data to templates */
interface HumanBestFriend {
  key: string;
  template?: TemplateRef<any>;
  context: {
    description: string;
    breeds: { name: string; image: string }[];
  };
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit {
  /** Value for displaying selection inside an ngContainer */
  breedSelection: string;

  /** SECTION: Switch between templates without attaching a context */
  /** List of available breeds */
  breedsWithoutContext: TemplateType[] = [];
  /** Template that we want to display during initialization and after user selection */
  selectedBreedTemplate: TemplateRef<any>;
  /** Getting the template references that we want to display */
  @ViewChild('dogsTemplate', { static: true }) dogsTemplate: TemplateRef<any>;
  @ViewChild('catsTemplate', { static: true }) catsTemplate: TemplateRef<any>;

  /** SECTION: Switch between templates attaching a context to templates */
  /** List of available breeds */
  breedsWithContext: HumanBestFriend[] = [];
  /** Template that we want to display during initialization and after user selection */
  selectedBreedWithContext: HumanBestFriend = null;
  @ViewChild('listOfDogs', { static: true })
  listOfDogsTemplate: TemplateRef<any>;
  @ViewChild('listOfCats', { static: true })
  listOfCatsTemplate: TemplateRef<any>;
  /** END SECTION */

  constructor(private readonly cd: ChangeDetectorRef) {
    /** Initialization of objects */
    this.breedSelection = 'Dogs';
    this.breedsWithoutContext = [{ key: 'Dogs' }, { key: 'Cats' }];
    this.breedsWithContext = [
      {
        key: 'Dogs',
        context: {
          description: 'Breeds of dogs',
          breeds: [
            {
              name: 'German Shepard',
              image:
                'https://th.bing.com/th/id/R.c2fcb99c7aad613b995442c21823bd7e?rik=8hF4DISV9UzXXw&pid=ImgRaw&r=0',
            },
            {
              name: 'Corgi',
              image:
                'https://th.bing.com/th/id/R.49fc9f797a6f4c773ed8e63543dc7ba2?rik=wTO1x71kcIvEEg&riu=http%3a%2f%2f4.bp.blogspot.com%2f-ZtI8ADZmxPg%2fTpmD-tg6iII%2fAAAAAAAAH2o%2fd84ckw4xIU4%2fs1600%2fpembroke-welsh-corgi-pictures5.JPG&ehk=tKReOcseGSPRuKsgHD7%2f7L5aAd8F4jQc%2bL5xjEPls%2bI%3d&risl=&pid=ImgRaw&r=0',
            },
            {
              name: 'Jack Russell',
              image:
                'https://th.bing.com/th/id/R.213e30f1611ecadb03eff10b4db7c72e?rik=L3MRRzzStvMXkQ&pid=ImgRaw&r=0',
            },
          ],
        },
      },
      {
        key: 'Cats',
        context: {
          description: 'Breeds of cats',
          breeds: [
            {
              name: 'Birman',
              image:
                'https://th.bing.com/th/id/OIP.DwHZfV5FE1GdfdPerMdbEQHaFE?w=255&h=180&c=7&r=0&o=5&pid=1.7',
            },
            {
              name: 'Siamese',
              image:
                'https://www.photos-public-domain.com/wp-content/uploads/2010/12/siamese_cat.jpg',
            },
            {
              name: 'Sphynx',
              image:
                'https://th.bing.com/th/id/OIP.9pyFTIUTkSf2Hx40MS4CRwHaE8?pid=ImgDet&rs=1',
            },
          ],
        },
      },
    ];
  }

  ngOnInit() {}

  /** We use this because ViewChilds are assigned after the View it is initialized. */
  ngAfterViewInit() {
    /** Assign template to each object */
    this.breedsWithoutContext = this.breedsWithoutContext.map(
      (breedWithoutContext) => {
        breedWithoutContext.associatedTemplate =
          breedWithoutContext.key === 'Dogs'
            ? this.dogsTemplate
            : this.catsTemplate;
        return breedWithoutContext;
      }
    );
    this.selectedBreedTemplate =
      this.breedsWithoutContext[0].associatedTemplate;

    this.breedsWithContext = this.breedsWithContext.map((breedWithContext) => {
      breedWithContext.template =
        breedWithContext.key === 'Dogs'
          ? this.listOfDogsTemplate
          : this.listOfCatsTemplate;
      return breedWithContext;
    });
    this.selectedBreedWithContext = this.breedsWithContext[0];
    this.cd.detectChanges();
  }

  /** Handles user selection */
  selectBreed(templateKey: string) {
    this.breedSelection = templateKey;

    const templateType = this.breedsWithoutContext.find(
      (t) => t.key === templateKey
    );
    this.selectedBreedTemplate = templateType.associatedTemplate;
    const foundBestFriend = this.breedsWithContext.find(
      (bf) => bf.key === templateKey
    );
    this.selectedBreedWithContext = foundBestFriend;
  }
}
