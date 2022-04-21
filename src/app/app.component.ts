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
    breeds: string[];
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
          breeds: ['German Shepard', 'Corgi', 'Fox Terrier'],
        },
      },
      {
        key: 'Cats',
        context: {
          description: 'Breeds of cats',
          breeds: ['Birman', 'Siamese', 'Sphynx'],
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
