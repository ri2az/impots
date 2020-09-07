const PARTS = [
    {limit:10064, taxe: 0},
    {limit:25659, taxe: 0.11},
    {limit:73369, taxe: 0.3},
    {limit:157806, taxe: 0.41},
    {limit:'+' , taxe: 0.45}
];
    
function Field ({name, label, value, onChange, help}) {
    return (
        <div className="form-group">
            <label className={"text-left"} htmlFor={name}><strong>{label}</strong></label>
            <div className="input-group">
                <input name={name} type="number" className="form-control" id={name} value={value} onChange={onChange}/>
                <div className="input-group-append">
                    <div className="input-group-text">€</div>
                </div>
            </div>
            <small className="form-text text-left text-muted">{help}</small>
        </div>
    )   
}

function Table ({parts, tranches}) {
    return (
        <table className="table table-striped table-bordered">
            <thead>
            <tr>
                <th scope="col">Tranche n°</th>
                <th scope="col">Montant des revenus</th>
                <th scope="col">Imposition</th>
                <th scope="col">Impot payé</th>
            </tr>
            </thead>
            <tbody>
                {parts.map( function(part, index) {
                    return (
                        <Row 
                            key={index}
                            index={index+1} 
                            limit={ 
                                    ( (index === 0) ? numeral(0).format('0,0') + ' €' : numeral(parts[index-1].limit).format('€0,0') + ' €') + ' - ' + 
                                    ( (index === parts.length - 1) ? 'ou plus' : numeral(part.limit).format('0,0') + ' €' )
                                    } 
                            taxe={numeral(part.taxe).format('0%')} 
                            pay={numeral(tranches[index]).format('0,0')}
                        />
                    )
                })}
            </tbody>
        </table>
    )   
}

function Row ({index, limit, taxe, pay}) {
    return (
        <tr>
            <td>{index}</td>
            <td>{limit}</td>
            <td>{taxe}</td>
            <td>{pay + ' €'}</td>
        </tr>
    )
} 

class Home extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            gain: '',
            taxes : '',
            parts : 1,
            couple : false,
            childrens : 0,
            CMIchildrens : 0,
        }

        this.limit = PARTS.map( part => part.limit)
        this.percentage = PARTS.map( part => part.taxe)
        this.impots = 0; 
        this.tranches = new Array(this.limit.length).fill(0);
    }

   calcQuotien = () => {

        let quotient = 1;

        if (this.state.couple) quotient ++;
      
        if (this.state.childrens > 0)
          if (this.state.childrens <= 2) 
            quotient = quotient + 0.5 * this.state.childrens;
          else 
            quotient = quotient + (this.state.childrens - 2) * 1 + 1; 

        this.setState({parts:quotient})
    }

    calcTaxes = () =>  {

        this.impots = 0;
        this.tranches = new Array(this.limit.length).fill(0);

        this.state.gain = this.state.gain / this.state.parts;
        let impots = this.calc();
        return impots * this.parts;
    }

    calc = (index = 1) => {

        if (this.state.gain <= this.limit[0]) return 0
      
        if (index != this.limit.length - 1 && this.state.gain > this.limit[index]) {
          let pay = (this.limit[index] - this.limit[index-1]) * this.percentage[index];
          this.impots += pay;
          this.tranches[index] = pay;
          return this.calc(index+1) 
        }
        else {
          let pay = (this.state.gain - this.limit[index-1]) * this.percentage[index];
          this.tranches[index] = pay;
          return this.impots += pay;
        }
    }

    handleChange = (e) => {

        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = e.target.name;

        this.setState({
            [name]: value,
        }, () => {
            this.calcQuotien();
            this.setState({
                taxes:this.calcTaxes()
            })
        })
    }

    render () {
        return (
            <React.Fragment>
                <div className="jumbotron bg-primary text-light text-center shadow rounded-O"> 
                    <h1>Simulateur impot sur le revenu</h1>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm">  
                            <div className="card shadow border-primary text-center">
                                <div className="card-header text-primary">
                                    <h5 className="mb-0">1. Je renseigne mes revenus</h5>
                                </div>
                                <div className="card-body">
                                    <Field 
                                        name={'gain'} 
                                        label={'Revenus net imposable'} 
                                        help={'Il s\'agit de vos revenus net imposables après l\'abattement forfaitaire ou réel'} 
                                        value={this.state.gain} 
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                        </div>  
                        <div className="col-sm">  
                            <div className="card shadow border-primary text-center">
                                <div className="card-header text-primary">
                                    <h5 className="mb-0">2. Je renseigne les caracterisque de mon foyer fiscal</h5>
                                </div>
                                <div className="card-body">
                                    <div className="form-check text-left">
                                        <input 
                                            name={'couple'} 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            checked={this.state.couple}
                                            onChange={this.handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            Je suis marié.e (ou pacsé.e)
                                        </label>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col">
                                            <Field 
                                                name={'childrens'} 
                                                label={'Mes enfants a charge'} 
                                                help={'Saisissez le nombre d\'enfants total à votre charge'} 
                                                value={this.state.childrens}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <Field 
                                                name={'CMIchildrens'} 
                                                label={'Mes enfants titulaires de la CMI'} 
                                                help={'Saisissez le nombre de vos enfants titulaires de la CMI parmi tous vos enfants à charge'} 
                                                value={this.state.CMIchildrens}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <div className="card shadow border-primary text-center">
                                <div className="card-header text-primary">
                                    <h5 className="mb-0">3. Je consulte le résultat de ma simulation</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <p className="alert alert-primary">Impot a payer : {numeral(Math.round(this.state.taxes)).format('0,0') + ' €'}</p>
                                            <p className="alert alert-primary">En pourcentage de votre salaire : {(this.state.taxes / this.state.gain * 100).toFixed(2) + '%' }</p>
                                            <p className="alert alert-primary">Nombre de part fiscal : {this.state.parts}</p>
                                            <p className="alert alert-primary">Revenus apres impots : {numeral(this.state.gain - Math.round(this.state.taxes)).format('0,0') + ' €'}</p>
                                        </div> 
                                        <div className="col">
                                            <Table parts={PARTS} tranches={this.tranches}/>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>
                <div className="text-center mt-4"> 
                    <p className={"text-muted"}>Reponse au challenge de Grafikart : <a className={"text-primary"} href="">Grafikart</a></p>
                    <p className={"text-muted"}>Source : <a href="">Source</a></p>
                </div>
            </React.Fragment>
        )
        
    }
}


ReactDOM.render(<Home/> , document.querySelector('#app'));