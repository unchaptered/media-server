
import 'reflect-metadata';
import { SemaphoreService } from '@semaphore/semaphore.service';

describe('[UNIT] Semaphore Service', () => {

    let sutSemaphoreService: SemaphoreService;

    beforeEach(() => sutSemaphoreService = new SemaphoreService());

    describe('[REF]', () => {
        it('SempahoreService must be defined defined', () => expect(sutSemaphoreService).toBeDefined())
        it('SempahoreService must be instance of SempahoreService', () => expect(sutSemaphoreService).toBeInstanceOf(SemaphoreService));

        it('SemaphoreService.prototype.isAvailableSemByTaskName must be defined', () => expect(sutSemaphoreService.isAvailableSemByTaskName).toBeDefined());
        it('SemaphoreService.prototype.getSemInstanceByTaskName must be defined', () => expect(sutSemaphoreService.getSemInstanceByTaskName).toBeDefined());
    });

    describe('[CORE]', () => {

        it('SemaphoreService.prototype.getSemInstanceByTaskName must return semphore(2), called with \'to264\'', async () => {
            
            const sutSemaphore = await sutSemaphoreService.getSemInstanceByTaskName('to264');
            const keys = Object.keys(sutSemaphore);

            expect(keys).toEqual(['capacity', 'current', 'queue', 'firstHere', 'take', 'leave', 'available']);

            expect(sutSemaphore.capacity).toBe(2);
            expect(sutSemaphore.current).toBe(0);
            expect(sutSemaphore.queue).toEqual([]);

            expect(typeof sutSemaphore.firstHere).toBe('boolean');
            expect(typeof sutSemaphore.take).toBe('function');
            expect(typeof sutSemaphore.leave).toBe('function');
            expect(typeof sutSemaphore.available).toBe('function');
            
        });
        
        it('SemaphoreService.prototype.getSemInstanceByTaskName must return semphore(2), called with \'detectAboutFailToH264\'', async () => {

            const sutSemaphore = await sutSemaphoreService.getSemInstanceByTaskName('detectAboutFailToH264');
            const keys = Object.keys(sutSemaphore);

            expect(keys).toEqual(['capacity', 'current', 'queue', 'firstHere', 'take', 'leave', 'available']);

            expect(sutSemaphore.capacity).toBe(2);
            expect(sutSemaphore.current).toBe(0);
            expect(sutSemaphore.queue).toEqual([]);

            expect(typeof sutSemaphore.firstHere).toBe('boolean');
            expect(typeof sutSemaphore.take).toBe('function');
            expect(typeof sutSemaphore.leave).toBe('function');
            expect(typeof sutSemaphore.available).toBe('function');
            
        });

        it('SemaphoreService.prototype.isAvailableSemByTaskName should return true(default) or false, called with\'toH264\'', async () => {

            const isAvailable = sutSemaphoreService.isAvailableSemByTaskName('to264');
            expect(isAvailable).toBeTruthy();
            
            sutSemaphoreService.getSemInstanceByTaskName('to264').take(() => setTimeout(() => {}, 1000));
            sutSemaphoreService.getSemInstanceByTaskName('to264').take(() => setTimeout(() => {}, 1000));
            
            const isAvailableAft = sutSemaphoreService.isAvailableSemByTaskName('to264');
            expect(isAvailableAft).toBeFalsy();

        });

        it('SemaphoreService.prototype.isAvailableSemByTaskName should return true(default) or false, called with\'detectAboutFailToH264\'', async () => {

            const isAvailable = sutSemaphoreService.isAvailableSemByTaskName('detectAboutFailToH264');
            expect(isAvailable).toBeTruthy();
            
            sutSemaphoreService.getSemInstanceByTaskName('detectAboutFailToH264').take(() => setTimeout(() => {}, 1000));
            sutSemaphoreService.getSemInstanceByTaskName('detectAboutFailToH264').take(() => setTimeout(() => {}, 1000));
            
            const isAvailableAft = sutSemaphoreService.isAvailableSemByTaskName('detectAboutFailToH264');
            expect(isAvailableAft).toBeFalsy();

        });

    });


});