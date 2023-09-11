import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import Location from '../models/Location.js';
import { connect, closeDatabase, clearDatabase } from '../config/testsDatabase.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Locations API', () => {

    let locationId; // Para almacenar el ID de la ubicación creada

    before(function() {
        this.timeout(5000); // Ajustar el tiempo de espera a 5000ms
        return connect();
    });

    const testDate = new Date('2022-05-21');

    beforeEach(async () => {
        // Crear una nueva ubicación antes de cada prueba
        const newLocation = new Location({
            deviceId: 'device1',
            longitude: 12.34,
            latitude: 56.78,
            date: testDate,
            time: '12:34',
            interests: []
        });
        await newLocation.save();
        locationId = newLocation._id; // Guardar el ID para su uso posterior en las pruebas
    });

    afterEach(async () => await clearDatabase());
    after(async () => await closeDatabase());

    it('should create a new location', done => {
        chai.request(app)
            .post('/locations')
            .send({
                deviceId: 'device1',
                longitude: 12.34,
                latitude: 56.78,
                date: new Date(),
                time: '12:34'
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('should get locations by date and time', done => {
        chai.request(app)
            .get(`/locations/datetime?date=${testDate}&time=12:34`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should get locations by device ID', done => {
        chai.request(app)
            .get('/locations/device/device1')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should add interests to an existing location', done => {
        chai.request(app)
            .put(`/locations/${locationId}/interests`)
            .send({ interests: ['Swimming', 'Reading'] })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should get locations by date range', done => {
        const startDate = new Date('2021-01-01');
        const endDate = new Date('2021-12-31');
        chai.request(app)
            .get(`/locations/daterange?startDate=${startDate}&endDate=${endDate}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should get locations by interests', done => {
        chai.request(app)
            .get('/locations/interests?interests=Swimming,Reading')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Prueba para obtener ubicación por un ID no existente
    it('should return 404 for a non-existing location ID', done => {
        chai.request(app)
            .get(`/locations/device?deviceId=9999999`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    // Prueba para obtener ubicaciones por un rango de fechas no válido
    it('should return 400 for an invalid date range', done => {
        chai.request(app)
            .get(`/locations/daterange?startDate=invalidDate&endDate=anotherInvalidDate`)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    // Prueba para añadir intereses a una ubicación no existente
    it('should return 404 when adding interests to a non-existing location', done => {
        chai.request(app)
            .put(`/locations/999999999999/interests`)
            .send({ interests: ['Swimming', 'Reading'] })
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    // Prueba para obtener ubicaciones sin intereses específicos
    it('should return 200 but an empty list when fetching locations by non-matching interests', done => {
        chai.request(app)
            .get('/locations/interests?interests=Skydiving,MountainClimbing')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.is.empty;
                done();
            });
    });
});
