from flask import Flask, render_template, request, url_for


app = Flask(__name__)


@app.route('/')
def route_index():
    return render_template('welcome.html')
    # return render_template('index.html')



@app.route('/play')
def route_play():
    player1 = request.args.get('player1')
    player2 = request.args.get('player2')
    player3 = request.args.get('player3')
    player4 = request.args.get('player4')
    return render_template('index.html', player1=player1, player2=player2, player3=player3, player4=player4)


if __name__ == '__main__':
    app.run(debug=True)