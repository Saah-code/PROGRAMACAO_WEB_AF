
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

// Schema da movimentação
const movimentacaoSchema = new mongoose.Schema({
    descricao: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },

    tipo: {
        type: String,
        required: true,
        enum: ['Receita', 'Despesa']
    },

    categoria: {
        type: String,
        required: true,
        trim: true
    },

    valor: {
        type: Number,
        required: true,
        min: 0.01
    },

    data: {
        type: Date,
        required: true
    }
}, {
    collection: 'movimentacoes',
    timestamps: true
});

// Model da movimentação
const Movimentacao = mongoose.model(
    'Movimentacao',
    movimentacaoSchema,
    'movimentacoes'
);

// Rota inicial
app.get('/', (req, res) => {
    res.json({
        msg: 'API do Gestor Financeiro rodando'
    });
});

// Cadastrar movimentação
app.post('/movimentacoes', async (req, res) => {
  try {
    const movimentacao = await Movimentacao.create(req.body);

    res.status(201).json(movimentacao);

  } catch (err) {
    res.status(400).json({
      erro: err.message
    });
  }
});

// Listar movimentações
app.get('/movimentacoes', async (req, res) => {
    try {
        const movimentacoes = await Movimentacao.find();

        res.json(movimentacoes);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

// Rota inicial
app.get('/', (req, res) => {
    res.json({
        msg: 'API do Gestor Financeiro rodando'
    });
});

// Cadastrar movimentação
app.post('/movimentacoes', async (req, res) => {
    try {
        const movimentacao = await Movimentacao.create(req.body);
        res.status(201).json(movimentacao);
    } catch (err) {
        res.status(400).json({
            erro: err.message
        });
    }
});

// Listar movimentações
app.get('/movimentacoes', async (req, res) => {
    try {
        const movimentacoes = await Movimentacao.find();
        res.json(movimentacoes);
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

// EDITAR movimentação
app.put('/movimentacoes/:id', async (req, res) => {
    try {
        const movimentacao = await Movimentacao.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!movimentacao) {
            return res.status(404).json({
                msg: 'Movimentação não encontrada'
            });
        }

        res.json(movimentacao);

    } catch (err) {
        res.status(400).json({
            erro: err.message
        });
    }
});

// Excluir movimentação
app.delete('/movimentacoes/:id', async (req, res) => {
    try {
        const movimentacao = await Movimentacao.findByIdAndDelete(
            req.params.id
        );

        if (!movimentacao) {
            return res.status(404).json({
                msg: 'Movimentação não encontrada'
            });
        }

        res.json({
            msg: 'Movimentação excluída com sucesso'
        });

    } catch (err) {
        res.status(400).json({
            erro: err.message
        });
    }
});

// Conectar ao MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'gestorFinanceiro'
})
.then(() => {
    console.log('Conectado ao MongoDB');
    console.log('Banco conectado:', mongoose.connection.name);

    // Iniciar servidor
    app.listen(process.env.PORT, () => {
        console.log(
            'Servidor rodando em http://localhost:' + process.env.PORT
        );
    });
})
.catch(err => {
    console.error('Erro na conexão:', err.message);
});

