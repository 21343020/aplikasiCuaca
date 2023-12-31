const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')

const app = express()
const port = process.env.PORT || 4000

// mendefinisikan jalur/path untuk konfigurasi express
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

// setup hanslebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)

// setup direktori statis
app.use(express.static(direktoriPublic))

//page utama
app.get('', (req, res) => {
    res.render('index', {
        judul   : 'Aplikasi Cek Cuaca',
        nama    : 'Budi Prasetyo'
    })
})

//halaman FAQ
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        judul       : 'Bantuan',
        nama        : 'Budi Prasetyo',
        teksBantuan : 'ini adalah teks bantuan',
        faq1 : "A: Halaman ini digunakan untuk apa?",
        faq2 : "A: Apa itu API?",
        faq3 : "A: API apa yang digunakan dalam aplikasi ini?",
        faq4 : "A: Pola arsitektur API RESTful "
    })
})

//halaman info cuaca
app.get('/infoCuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukkan lokasi yang ingin dicari'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if(error){
                return res.send({error})
            }
            res.send({
                prediksiCuaca : dataPrediksi,
                lokasi : location,
                address : req.query.address
            })
        })
    })
})

//halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul   : 'Tentang Saya',
        nama    : 'Budi Prasetyo'
    })
})

app.get('/berita', (req, res) => {
    res.render('berita', {
        judul   : 'Berita',
        nama    : 'Budi Prasetyo'
    })
})

app.get('/bantuan/*', (req, res) => {
    res.render('404', {
        judul : '404',
        nama : 'Budi Prasetyo',
        pesanKesalahan : 'Artikel yang dicari tidak ditemukan'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        judul : '404',
        nama : 'Budi Prasetyo',
        pesanKesalahan : 'Halaman Tidak Ditemukan'
    })
})

app.listen(port, () => {
    console.log('Server Berjalan Pada '+ port)
})