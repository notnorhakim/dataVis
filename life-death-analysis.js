function LifeDeathAnalysis() {
    // Name for the visualisation to appear in the menu bar.
    this.name = 'Life and Death Statistics';

    // Each visualisation must have a unique ID with no special characters.
    this.id = 'life-and-death-analyis';

    // Title to display above the plot.
    this.title = 'Average Statistics of             ';

    // Names for each axis.
    this.xAxisLabel = 'Year';
    this.yAxisLabel = 'No. of people';
    var marginSize = 35;

    //Stats Names for mouseOver
    this.sg_death_people = 0;
    this.sg_birth_people = 0;
    this.year = 0;

    // Layout object to store all common plot layout parameters and methods.
    this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize *2,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 2,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on top of one another.
    numXTickLabels: 20,
    numYTickLabels: 20,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/population/singapore.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

  };


  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    // Font defaults.
    textSize(16);

    // Create a select DOM element for Country
    this.select = createSelect();
    this.select.position(875,16);
   //options for the first drop down menu
    this.select.option("singapore");
    this.select.option("ice_land");
    this.select.option("argentina");
    this.select.option("australia");
    this.select.option("malaysia");
    this.select.option("japan");
    this.select.option("UAE");
    this.select.option("france");
    this.select.option("new_zealand");
    this.select.option("germany");
    this.select.option("brazil");
    this.select.option("cuba");

    // Create a select DOM element for Type of Rate
    this.select2 = createSelect();
    this.select2.position(990,16);
    //options for the second drop down menu
    this.select2.option("Birth Rate");
    this.select2.option("Death Rate");
    this.select2.option("Birth Rate and Death Rate");
  };

  this.destroy = function() {
    this.select.remove();
    this.select2.remove();

  };

  //make a new Bar Graph for different countries
  this.bar = new Bar(this.layout,this.title,this.xAxisLabel,this.yAxisLabel,marginSize);

  this.draw = function() {

    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    //select the country value from the selection
    var country = this.select.value();
    //select the type of rate value from the selection
    var type_of_data = this.select2.value();
    //converting the value of the selection to the header name of the data csv file 
    // example converting from 'singapore' to 'singapore_death_rate' which is one of the heading from the csv file
    var death_convert = country  + '_death_rate';
    var birth_convert = country + '_birth_rate';
    var population_convert = country + '_population';
    //getting the column data of the converted heading from the csv file in data 
    var death_rate = this.data.getColumn(death_convert);
    var birth_rate = this.data.getColumn(birth_convert);
    var population = this.data.getColumn(population_convert);
    var year = this.data.getColumn('year')
    //drawing a new bar graph with data from different countries
    this.bar.draw(year,death_rate,birth_rate,population,type_of_data);

  }
}