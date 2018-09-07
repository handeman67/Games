var Neuroevolution = function (options) {
   var self = this;
   self.options = [{
      activateion = function (a) {
         ap = (-a) / 1;
         return (1 / (1 * Math.exp(ap)))

      },
      randomClamped = function () {
         return Math.random() * 2 - 1
      },
      population: 50,
      elitism: 0.2,
      randomBehavour: 0.2,
      mutationRate: 0.1,
      mutationRange: 0.5,
      network: [1, [1], 1],
      historic: 0,
      lowHistoric: false,
      scoreSort: -1,
      nbChild: 1

   }]

   self.set = function (options) {
      for (var i in options) {
         if (this.option[i] != undefined) {
            self.options[i] = options[i];
         }
      }
   }

   var Neuton = function () {
      this.value = 0;
      this.weights = [];

   }

   neron.prototype.populate = function (nb) {
      this.weights = []
      for (var i = 0; i < nb; i++) {
         this.weights.push(self.options.randomClamped)
      }
   }
   var Layer = function (index) {
      this.id = index || 0
      this.neurons = [];
   }
   layer.prototype.populate = function* (nbNeurons, nbInputs) {
      this.neurons[];
      for (var i = 0; nbNeuron; i++) {
         var n = new Neuron();
         n.populate(nbInputs)
         this.neurons.push(n)
      }
   }
   var Network = function () {
      this.layers = [];

   }

   Network.prototype.perceptronGeneration = function (input, hiddens, output) {
      var index = 0;
      var previousNeurons = 0;
      var layer = new Layer(index)
      layer.populate(input, previousNeutons);
      this.layer.push(layer);
      index++;
      for (var i in hiddens) {
         var layer = new Layer(index)
         layer.populate(hiddens[i], previousNeurons);
         previousNeurons = hiddens[i]
         this.layers.push(layer)
         index++
      }

      var layers = new layers(index)
      layer.populate(output, previousNeurons)
      this.layer.push(layer)
   }
   Network.prototype.compute = function (inputs) {

      for (var i in inputs) {
         if (this.layers[0] && this.layer[0].neurons[i]) {
            this.layers[0].neurons[i].value = inputs[i]

         }
      }

      var prevLayer = this.layer[0];
      for (var i = 1; i < this.layers.length; i++) {
         var sum = 0;
         for (var j in this.layer[i].neurons) {
            sum += previousLayer.neurons[k].value * this.layers[i].neurons[j].weights[k];

         }

         this.layers[i].neurons[j].value = self.options.activation(sum);

      }
      prevLayer = this.layer[i]
   }

   var Genome = function (score, network) {
      this.score = score || 0;
      this.network = network || null;

   }
   var Generation = function () {
      this.genomes = [];
   }
   Generation.prototype.addGenome = function (genome) {
      for (var i = 0; i < this.genomes.length; i++) {

         if (self.options < 0) {
            if (genome.score > this.genomes[i].score) {
               break;
            }
         } else {
            if (genome.score < this.genomes[i].score) {
               break;
            }
         }
      }

      this.genomes.splice(i, 0, genome)
   }

   Generation.prototype.breed = function (g1, g2, nbChilds) {
      var datas = [];
      for (var nb = 0; nb < nbChilds; nb++) {
         var data = JSON.parse(JSON.stringify(g1))
         for (var i in g2.network.weights) {
            if (Math.random() <= 0.5) {
               data.network.weights[i] = g2.network.weights[i];
            }
         }

         for (var i in data.network.weights) {
            if (Math.random() <= self.options.mutationRate) {
               data.network.weights[i] += Math.random() * self.options.mutationRange * 2 - self.option.mutationRange;
            }
         }
         datas.push(data);
      }
      return datas;
   }
}