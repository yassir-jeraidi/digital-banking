import {
	ChangeDetectionStrategy,
	Component,
	HostListener,
	type InputSignal,
	type Signal,
	ViewEncapsulation,
	computed,
	input,
	signal,
	viewChild,
} from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';
import {
	EmblaCarouselDirective,
	type EmblaEventType,
	type EmblaOptionsType,
	type EmblaPluginType,
} from 'embla-carousel-angular';

@Component({
	selector: 'hlm-carousel',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '_computedClass()',
		role: 'region',
		'aria-roledescription': 'carousel',
	},
	imports: [EmblaCarouselDirective],
	template: `
		<div
			emblaCarousel
			class="overflow-hidden"
			[plugins]="plugins()"
			[options]="emblaOptions()"
			[subscribeToEvents]="['init', 'select', 'reInit']"
			(emblaChange)="onEmblaEvent($event)"
		>
			<ng-content select="hlm-carousel-content" />
		</div>
		<ng-content />
	`,
})
export class HlmCarouselComponent {
	protected emblaCarousel = viewChild.required(EmblaCarouselDirective);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('relative', this.userClass()));

	public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
	public readonly options: InputSignal<Omit<EmblaOptionsType, 'axis'> | undefined> = input();
	public readonly plugins: InputSignal<EmblaPluginType[]> = input([] as EmblaPluginType[]);

	protected emblaOptions: Signal<EmblaOptionsType> = computed(() => ({
		...this.options(),
		axis: this.orientation() === 'horizontal' ? 'x' : 'y',
	}));

	private readonly _canScrollPrev = signal(false);
	public readonly canScrollPrev = this._canScrollPrev.asReadonly();
	private readonly _canScrollNext = signal(false);
	public readonly canScrollNext = this._canScrollNext.asReadonly();

	private readonly _currentSlide = signal(0);
	public readonly currentSlide = this._currentSlide.asReadonly();
	private readonly _slideCount = signal(0);
	public readonly slideCount = this._slideCount.asReadonly();

	protected onEmblaEvent(event: EmblaEventType) {
		const emblaApi = this.emblaCarousel().emblaApi;

		if (!emblaApi) {
			return;
		}

		if (event === 'select' || event === 'init' || event === 'reInit') {
			this._canScrollPrev.set(emblaApi.canScrollPrev());
			this._canScrollNext.set(emblaApi.canScrollNext());

			this._currentSlide.set(emblaApi.selectedScrollSnap());
			this._slideCount.set(emblaApi.scrollSnapList().length);
		}
	}

	@HostListener('keydown', ['$event'])
	protected onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			this.emblaCarousel().scrollPrev();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			this.emblaCarousel().scrollNext();
		}
	}

	scrollPrev() {
		this.emblaCarousel().scrollPrev();
	}

	scrollNext() {
		this.emblaCarousel().scrollNext();
	}
}
