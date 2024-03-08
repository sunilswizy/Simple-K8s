docker build -t sunil1912/multi-client -f ./client/Dockerfile ./client
docker build -t sunil1912/multi-server -f ./server/Dockerfile ./server
docker build -t sunil1912/multi-worker -f ./worker/Dockerfile ./worker

docker push sunil1912/multi-client
docker push sunil1912/multi-server
docker push sunil1912/multi-worker


gcloud container clusters get-credentials examly-projects --zone asia-south2-a --project examly-dev
kubectl apply -f k8s